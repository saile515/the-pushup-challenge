import { redirect } from '@sveltejs/kit';
import {
	DISCORD_API_URL,
	DISCORD_CDN_URL,
	DISCORD_CLIENT_ID,
	DISCORD_SECRET,
	SITE_URL,
	NODE_ENV
} from '$env/static/private';
import type { PageServerLoad } from './$types';
import { User, Session, AuthProvider } from '$lib/database';
import { randomBytes } from 'crypto';

export const load: PageServerLoad = async ({ url, cookies }) => {
	if (cookies.get('session')) {
		redirect(303, '/');
	}

	const code = url.searchParams.get('code');

	if (!code) {
		return;
	}

	const query = {
		client_id: DISCORD_CLIENT_ID,
		client_secret: DISCORD_SECRET,
		code: code,
		grant_type: 'authorization_code',
		redirect_uri: `${SITE_URL}/auth`,
		scope: 'identify'
	};

	const response = await fetch(`${DISCORD_API_URL}/api/v10/oauth2/token`, {
		method: 'POST',
		body: new URLSearchParams(query).toString(),
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	}).then((res) => res.json());

	if (response.error) {
		redirect(303, '/auth');
	}

	const userData = await fetch(`${DISCORD_API_URL}/api/v10/users/@me`, {
		headers: {
			Authorization: `Bearer ${response.access_token}`
		}
	}).then((res) => res.json());

	const [user] = await User.findOrCreate({
		where: {
			id: userData.id
		},
		defaults: {
			username: userData.username,
			avatarUrl: `${DISCORD_CDN_URL}/avatars/${userData.id}/${userData.avatar}`
		} as User
	});

	const session = await Session.create({
		provider: AuthProvider.Discord,
		accessToken: response.access_token,
		refreshToken: response.refresh_token,
		expires: new Date(Date.now() + response.expires_in * 1000),
		sessionToken: randomBytes(24).toString('base64'),
		userId: user.id
	});

	cookies.set('session', session.sessionToken, {
		path: '/',
		httpOnly: true,
		secure: NODE_ENV == 'production',
		expires: new Date('2100-01-01')
	});

	redirect(303, '/');
};

async function authenticate() {
	const redirectUrl = new URL(DISCORD_API_URL);

	redirectUrl.pathname = '/oauth2/authorize';

	const query = new URLSearchParams();
	query.append('client_id', DISCORD_CLIENT_ID);
	query.append('response_type', 'code');
	query.append('redirect_uri', `${SITE_URL}/auth`);
	query.append('scope', 'identify');

	redirectUrl.search = query.toString();

	redirect(303, redirectUrl);
}

export const actions = {
	default: authenticate
};
