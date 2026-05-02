INSERT INTO Goals (type) VALUES
    ('calorie'),
    ('protein'),
    ('fiber')
ON CONFLICT (type) DO NOTHING;

INSERT INTO Activities (name, caloric_gain, amount, units) VALUES
    ('Apple', 95, 1, 'item'),
    ('Chicken Breast', 165, 100, 'grams'),
    ('Oatmeal', 150, 1, 'cup'),
    ('Black Beans', 227, 1, 'cup'),
    ('Running', -300, 30, 'minutes'),
    ('Cycling', -250, 30, 'minutes'),
    ('Weight Lifting', -180, 30, 'minutes')
ON CONFLICT (name) DO NOTHING;

INSERT INTO Foods (name, protein, fiber) VALUES
    ('Apple', 0, 4),
    ('Chicken Breast', 31, 0),
    ('Oatmeal', 6, 4),
    ('Black Beans', 15, 15)
ON CONFLICT (name) DO NOTHING;

INSERT INTO Exercises (name, type, weight) VALUES
    ('Running', 'cardio', 0),
    ('Cycling', 'cardio', 0),
    ('Weight Lifting', 'strength', 50)
ON CONFLICT (name) DO NOTHING;
