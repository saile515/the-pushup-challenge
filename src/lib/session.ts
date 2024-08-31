import { Session, User } from '$lib/database';
import type { Cookies } from '@sveltejs/kit';

export async function getUser(cookies: Cookies) {
	const sessionToken = cookies.get('session');

	if (!sessionToken) {
		return;
	}

	const session = await Session.findOne({
		where: { sessionToken: sessionToken },
		include: { model: User, as: 'user' }
	});

	if (!session || !session.user) {
		return;
	}

	return session.user;
}
