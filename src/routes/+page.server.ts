import type { PageServerLoad } from './$types';
import { ChallengeDay, User } from '$lib/database';
import { getUser } from '$lib/session';
import { cache } from '$lib/cache';
import type { Action } from '@sveltejs/kit';

function getDateWithoutTime(date: Date) {
	const newDate = new Date(date);

	newDate.setUTCHours(0);
	newDate.setUTCMinutes(0);
	newDate.setUTCSeconds(0);
	newDate.setUTCMilliseconds(0);

	return newDate;
}

async function createPreviousDays(user: User) {
	if (user.lastOnline && user.lastOnline >= getDateWithoutTime(new Date())) {
		return;
	}

	let date = new Date(user.joinDate);
	const today = getDateWithoutTime(new Date());
	let previousDay: ChallengeDay | null = null;

	while (getDateWithoutTime(date) <= today) {
		let targetScore = 10;

		if (previousDay) {
			if (previousDay.score == previousDay.targetScore) {
				targetScore = previousDay.targetScore + 1;
			} else {
				targetScore = previousDay.targetScore;
			}
		}

		[previousDay] = await ChallengeDay.findOrCreate({
			where: { userId: user.id, date: date },
			defaults: {
				targetScore: targetScore
			} as ChallengeDay
		});

		date.setDate(date.getDate() + 1);
	}

	user.lastOnline = today;
	user.save();
}

async function getLeaderboard() {
	const users = await User.findAll({ where: { public: true }, include: ChallengeDay });

	return users.map((_user) => {
		const user = _user as User & { ChallengeDays: ChallengeDay[] };

		const score = user.ChallengeDays.reduce(
			(total, challengeDay) =>
				total + (challengeDay.score == challengeDay.targetScore ? challengeDay.targetScore : 0),
			0
		);

		const days = user.ChallengeDays.sort((a, b) => b.date.getTime() - a.date.getTime());

		let i = 0;
		for (; i < days.length; i++) {
			if (days[i].score != days[i].targetScore) {
				break;
			}
		}

		return { ...user.toJSON(), score, streak: i };
	});
}

const getLeaderboardCached = cache('leaderboard', getLeaderboard, 3600000);

export const load: PageServerLoad = async ({ cookies }) => {
	const user = await getUser(cookies);

	if (!user) {
		return;
	}

	createPreviousDays(user);

	const today = await ChallengeDay.findOne({
		where: { userId: user.id, date: getDateWithoutTime(new Date()) }
	});

	if (!today) {
		return;
	}

	const previousDays = await ChallengeDay.findAll({
		where: { userId: user.id },
		order: [['date', 'DESC']],
		raw: true
	});

	return {
		user: user.toJSON(),
		today: today.toJSON(),
		leaderboard: await getLeaderboardCached(),
		previousDays: previousDays
	};
};

const updateScore: Action = async ({ request, cookies }) => {
	const user = await getUser(cookies);

	if (!user) {
		return;
	}

	const today = await ChallengeDay.findOne({
		where: { userId: user.id, date: getDateWithoutTime(new Date()) }
	});

	if (!today) {
		return;
	}

	const formData = await request.formData();

	const delta = parseInt(formData.get('delta') as string);

	today.score = Math.min(Math.max(today.score + delta, 0), today.targetScore);
	today.save();
};

export const actions = {
	updateScore
};
