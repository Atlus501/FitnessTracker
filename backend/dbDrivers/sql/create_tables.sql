-- Creating tables(relations) based on the Schema from Phase1

-- User table to keep track of users in the system
CREATE TABLE IF NOT EXISTS Users (
    id SERIAL PRIMARY KEY, -- serial helps to auto-increment the id when not specified
	name VARCHAR(255) UNIQUE NOT NULL, -- name of user
    password VARCHAR(255) NOT NULL, -- password can't be null
    is_male BOOLEAN NOT NULL, -- gender can't be null
    age SMALLINT NOT NULL CHECK (age >= 0), -- ensuring that age is a +ve int
    weight SMALLINT NOT NULL CHECK (weight >= 0), -- same for weight
    height SMALLINT NOT NULL CHECK (height >= 0)
);

-- Goals table: collection of possible nutritional and caloric goals
CREATE TABLE IF NOT EXISTS Goals (
    id SERIAL PRIMARY KEY, -- using serial again
    type VARCHAR(25) UNIQUE-- type of goal (bulk/cut/cardio etc.)
);

--create the parent Activities table
create table IF NOT EXISTS Activities(
	name VARCHAR(30) PRIMARY KEY,
	caloric_gain int NOT NULL,
	amount SMALLINT CHECK (amount >= 0) NOT NULL,
	units VARCHAR(20) NOT NULL
);

-- Optional exercise detail table from the Phase 1 design
create table IF NOT EXISTS Exercises(
	name varchar(30) PRIMARY KEY,
	type varchar(30) NOT NULL,
	weight SMALLINT CHECK(weight >= 0),
	FOREIGN KEY (name) REFERENCES Activities(name) ON DELETE CASCADE
);

--create Foods child table
create table IF NOT EXISTS Foods(
	name varchar(30) PRIMARY KEY,
	protein SMALLINT CHECK(protein >= 0) NOT NULL,
	fiber SMALLINT CHECK(fiber >= 0) NOT NULL,
	FOREIGN KEY (name) REFERENCES Activities(name) ON DELETE CASCADE
);

-- create HasManyGoals child table
create table IF NOT EXISTS HasManyGoals (
    user_id INT NOT NULL,
    goal_id INT NOT NULL,
    recommend_value INT,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (goal_id) REFERENCES Goals(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, goal_id)
);

-- create DoesDailyActivity child table
create table IF NOT EXISTS DoesDailyActivity (
    user_id INT NOT NULL,
    date DATE NOT NULL,
    amount_done SMALLINT CHECK (amount_done >= 0) NOT NULL,
    activity varchar(30) NOT NULL,
    PRIMARY KEY (user_id, date, activity),
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (activity) REFERENCES Activities(name)
);

-- create DailyProgressOfGoals child table
create table IF NOT EXISTS DailyProgressOfGoals (
    date DATE NOT NULL,
    daily_progress NUMERIC(3,2) CHECK (daily_progress >= 0 AND daily_progress <= 1) NOT NULL,
    user_id INT NOT NULL,
    goal_id INT NOT NULL,
    PRIMARY KEY (date, user_id, goal_id),
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id, goal_id) REFERENCES HasManyGoals(user_id, goal_id) ON DELETE CASCADE
);
