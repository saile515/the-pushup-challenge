import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { Session } from '$lib/database';
import { DISCORD_API_URL, DISCORD_CLIENT_ID, DISCORD_SECRET } from '$env/static/private';

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname == '/auth') {
		return await resolve(event);
	}

	const sessionToken = event.cookies.get('session');

	if (!sessionToken) {
		redirect(303, '/auth');
	}

	const session = await Session.findOne({ where: { sessionToken: sessionToken } });

	if (!session) {
		event.cookies.delete('session', { path: '/' });
		redirect(303, '/auth');
	}

	if (session.expires < new Date(Date.now() + 4800)) {
		const query = {
			client_id: DISCORD_CLIENT_ID,
			client_secret: DISCORD_SECRET,
			grant_type: 'refresh_token',
			refresh_token: session.refreshToken
		};

		const response = await fetch(`${DISCORD_API_URL}/api/v10/oauth2/token`, {
			method: 'POST',
			body: new URLSearchParams(query).toString(),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}).then((res) => res.json());

		console.log(response);

		if (response.error) {
			session.destroy();
			event.cookies.delete('session', { path: '/' });
			redirect(303, '/auth');
		}

		session.accessToken = response.access_token;
		session.refreshToken = response.refresh_token;
		session.expires = new Date(Date.now() + response.expires_in);

		session.save();
	}

	return await resolve(event);
};
