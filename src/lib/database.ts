import { Sequelize, Model, DataTypes } from 'sequelize';
import type { InferAttributes, InferCreationAttributes } from 'sequelize';
import { DATABASE_CONNECTION_STRING } from '$env/static/private';

const sequelize = new Sequelize(DATABASE_CONNECTION_STRING, { logging: false });

try {
	await sequelize.authenticate();
} catch (error) {
	console.error(`Database connection failed with the following error: ${error}`);
	process.exit();
}

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
	declare id: string;
	declare username: string;
	declare avatarUrl: string;
	declare joinDate: Date;
	declare lastOnline: Date;
	declare public: boolean;
}

export class ChallengeDay extends Model<
	InferAttributes<ChallengeDay>,
	InferCreationAttributes<ChallengeDay>
> {
	declare id: number;
	declare date: Date;
	declare targetScore: number;
	declare score: number;
	declare userId: number;
}

export enum AuthProvider {
	Discord = 'discord'
}

export class Session extends Model<InferAttributes<Session>, InferCreationAttributes<Session>> {
	declare id?: number;
	declare provider: AuthProvider;
	declare accessToken: string;
	declare refreshToken: string;
	declare sessionToken: string;
	declare expires: Date;
	declare userId: number;
	declare user?: User;
}

User.init(
	{
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
			allowNull: false,
			unique: true
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false
		},
		avatarUrl: {
			type: DataTypes.STRING,
			allowNull: false
		},
		joinDate: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW
		},
		public: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true
		},
		lastOnline: {
			type: DataTypes.DATE,
			allowNull: true
		}
	},
	{ sequelize, tableName: 'users' }
);

ChallengeDay.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true,
			unique: true
		},
		date: {
			type: DataTypes.DATEONLY,
			allowNull: false,
			defaultValue: DataTypes.NOW
		},
		targetScore: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		score: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		},
		userId: {
			type: DataTypes.INTEGER,
			references: {
				model: User,
				key: 'id'
			}
		}
	},

	{ sequelize, tableName: 'challenge_day' }
);

User.hasMany(ChallengeDay, { foreignKey: 'userId' });
ChallengeDay.belongsTo(User, { foreignKey: 'userId' });

Session.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true,
			unique: true
		},
		provider: {
			type: DataTypes.ENUM('discord'),
			allowNull: false
		},
		accessToken: {
			type: DataTypes.STRING,
			allowNull: false
		},
		refreshToken: {
			type: DataTypes.STRING,
			allowNull: false
		},
		sessionToken: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		expires: {
			type: DataTypes.DATE,
			allowNull: false
		},
		userId: {
			type: DataTypes.INTEGER,
			references: {
				model: User,
				key: 'id'
			}
		}
	},
	{ sequelize, tableName: 'sessions' }
);

Session.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasOne(Session, { foreignKey: 'userId', as: 'user' });

await sequelize.sync({ alter: true });
