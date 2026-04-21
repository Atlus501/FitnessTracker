-- Creating tables(relations) based on the Schema from Phase1

-- User table to keep track of users in the system
CREATE TABLE IF NOT EXISTS "User" (
    id SERIAL PRIMARY KEY, -- serial helps to auto-increment the id when not specified
	name VARCHAR(255) NOT NULL, -- name of user
    password VARCHAR(255) NOT NULL, -- password can't be null
    is_male BOOLEAN NOT NULL, -- gender can't be null
    age SMALLINT NOT NULL CHECK (age >= 0), -- ensuring that age is a +ve int
    weight SMALLINT NOT NULL CHECK (weight >= 0) -- same for weight
);

-- Goals table: collection of possible nutritional and caloric goals
CREATE TABLE IF NOT EXISTS Goals (
    id SERIAL PRIMARY KEY, -- using serial again
    type VARCHAR(255) NOT NULL, -- type of goal (bulk/cut/cardio etc.)
    base_recommendation INT NOT NULL, -- number of goals recommended
    age_modifier INT NOT NULL, -- modifications in base_recom. based on age
    sex_modifier INT NOT NULL, -- based on sex
    weight_modifier INT NOT NULL -- based on weight
);

--create the parent Activities table
create table IF NOT EXISTS Activities(
	id SERIAL PRIMARY KEY,
	caloric_gain int NOT NULL,
	amount SMALLINT CHECK (amount >= 0) NOT NULL,
	units VARCHAR(20) NOT NULL
);

--creates Exercises child table
create table IF NOT EXISTS Exercises(
	id INT PRIMARY KEY,
	type VARCHAR(20) NOT NULL,
	weights SMALLINT CHECK (weights >= 0),
	FOREIGN KEY(id) REFERENCES Activities(id) ON DELETE CASCADE
);

--create Foods child table
create table IF NOT EXISTS Foods(
	id INT PRIMARY KEY,
	name VARCHAR(30) NOT NULL,
	protein SMALLINT CHECK(protein >= 0) NOT NULL,
	fiber SMALLINT CHECK(fiber >= 0) NOT NULL,
	FOREIGN KEY (id) REFERENCES Activities(id) ON DELETE CASCADE
);

-- create HasManyGoals child table
create table IF NOT EXISTS HasManyGoals (
    composite_key SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    goal_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES "User"(id) ON DELETE CASCADE,
    FOREIGN KEY (goal_id) REFERENCES Goals(id) ON DELETE CASCADE
);

-- create DoesDailyActivity child table
create table IF NOT EXISTS DoesDailyActivity (
    user_id INT NOT NULL,
    date DATE NOT NULL,
    amount_done SMALLINT CHECK (amount_done >= 0) NOT NULL,
    activity_id INT NOT NULL,
    PRIMARY KEY (user_id, date, activity_id),
    FOREIGN KEY (user_id) REFERENCES "User"(id) ON DELETE CASCADE,
    FOREIGN KEY (activity_id) REFERENCES Activities(id)
);

-- create DailyProgressOfGoals child table
create table IF NOT EXISTS DailyProgressOfGoals (
    date DATE NOT NULL,
    daily_progress NUMERIC(5,2) CHECK (daily_progress >= 0 AND daily_progress <= 1) NOT NULL,
    user_id INT NOT NULL,
    goal_composite_key INT NOT NULL,
    PRIMARY KEY (date, user_id, goal_composite_key),
    FOREIGN KEY (user_id) REFERENCES "User"(id) ON DELETE CASCADE,
    FOREIGN KEY (goal_composite_key) REFERENCES HasManyGoals(composite_key) ON DELETE CASCADE
);
