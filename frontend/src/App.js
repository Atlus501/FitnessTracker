import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const emptyAccount = {
  name: '',
  password: '',
  is_male: true,
  age: 22,
  weight: 170,
  height: 170,
};

function App() {
  const [mode, setMode] = useState('login');
  const [account, setAccount] = useState(emptyAccount);
  const [user, setUser] = useState(null);
  const [goalTypes, setGoalTypes] = useState([]);
  const [goals, setGoals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [dailyActivities, setDailyActivities] = useState([]);
  const [progress, setProgress] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState('');
  const [activityForm, setActivityForm] = useState({ activity: '', amount_done: 1 });
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const progressByGoal = useMemo(() => {
    const map = {};
    progress.forEach((item) => {
      map[item.goal_id] = Number(item.daily_progress);
    });
    return map;
  }, [progress]);

  useEffect(() => {
    axios.get(`${API_URL}/goals`).then((res) => {
      setGoalTypes(res.data);
      if (res.data[0]) setSelectedGoal(String(res.data[0].id));
    }).catch(() => {});

    axios.get(`${API_URL}/activities`).then((res) => {
      setActivities(res.data);
      if (res.data[0]) setActivityForm((form) => ({ ...form, activity: res.data[0].name }));
    }).catch(() => {});
  }, []);

  const clearMessages = () => {
    setNotice('');
    setError('');
  };

  const loadUserData = async (userId) => {
    const [goalsResponse, dailyResponse, progressResponse] = await Promise.all([
      axios.get(`${API_URL}/goals/${userId}`),
      axios.get(`${API_URL}/activities/${userId}`),
      axios.get(`${API_URL}/progress/${userId}`),
    ]);

    setGoals(goalsResponse.data);
    setDailyActivities(dailyResponse.data);
    setProgress(progressResponse.data);
  };

  const submitAccount = async (event) => {
    event.preventDefault();
    clearMessages();

    try {
      const endpoint = mode === 'login' ? '/users/login' : '/users/register';
      const payload = mode === 'login'
        ? { name: account.name, password: account.password }
        : account;
      const response = await axios.post(`${API_URL}${endpoint}`, payload);

      setUser(response.data);
      await loadUserData(response.data.id);
      setNotice(mode === 'login' ? 'Logged in successfully.' : 'Account created successfully.');
    } catch (err) {
      setError(err.response?.data?.error || 'Account request failed.');
    }
  };

  const addGoal = async () => {
    if (!user || !selectedGoal) return;
    clearMessages();

    try {
      await axios.post(`${API_URL}/goals/record_goal`, {
        user_id: user.id,
        goal_id: Number(selectedGoal),
      });
      await loadUserData(user.id);
      setNotice('Goal saved with a personalized recommendation.');
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save goal.');
    }
  };

  const removeGoal = async (goalId) => {
    clearMessages();

    try {
      await axios.delete(`${API_URL}/goals/remove_goal`, {
        params: { user_id: user.id, goal_id: goalId },
      });
      await loadUserData(user.id);
      setNotice('Goal removed.');
    } catch (err) {
      setError(err.response?.data?.error || 'Could not remove goal.');
    }
  };

  const saveActivity = async (event) => {
    event.preventDefault();
    clearMessages();

    try {
      await axios.post(`${API_URL}/activities/record`, {
        user_id: user.id,
        activity: activityForm.activity,
        amount_done: Number(activityForm.amount_done),
      });
      await axios.post(`${API_URL}/progress/updateProgress`, { user_id: user.id });
      await loadUserData(user.id);
      setNotice('Activity saved and progress recalculated.');
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save activity.');
    }
  };

  const removeActivity = async (activity) => {
    clearMessages();

    try {
      await axios.delete(`${API_URL}/activities/remove`, {
        params: { user_id: user.id, activity },
      });
      await axios.post(`${API_URL}/progress/updateProgress`, { user_id: user.id });
      await loadUserData(user.id);
      setNotice('Activity deleted and progress recalculated.');
    } catch (err) {
      setError(err.response?.data?.error || 'Could not delete activity.');
    }
  };

  return (
    <main className="app-shell">
      <section className="masthead">
        <div>
          <p className="eyebrow">CSE 412 Phase 03</p>
          <h1>Fitness Tracker</h1>
          <p className="subhead">Track nutrition goals, daily activity, and progress from a PostgreSQL database.</p>
        </div>
        {user && (
          <button className="ghost-button" onClick={() => setUser(null)}>
            Sign out
          </button>
        )}
      </section>

      {notice && <p className="notice">{notice}</p>}
      {error && <p className="error">{error}</p>}

      {!user ? (
        <section className="auth-panel">
          <div className="mode-switch">
            <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Login</button>
            <button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Create Account</button>
          </div>

          <form onSubmit={submitAccount} className="form-grid">
            <label>
              Username
              <input value={account.name} onChange={(e) => setAccount({ ...account, name: e.target.value })} required />
            </label>
            <label>
              Password
              <input type="password" value={account.password} onChange={(e) => setAccount({ ...account, password: e.target.value })} required />
            </label>

            {mode === 'register' && (
              <>
                <label>
                  Sex
                  <select value={String(account.is_male)} onChange={(e) => setAccount({ ...account, is_male: e.target.value === 'true' })}>
                    <option value="true">Male</option>
                    <option value="false">Female</option>
                  </select>
                </label>
                <label>
                  Age
                  <input type="number" min="1" value={account.age} onChange={(e) => setAccount({ ...account, age: Number(e.target.value) })} required />
                </label>
                <label>
                  Weight
                  <input type="number" min="1" value={account.weight} onChange={(e) => setAccount({ ...account, weight: Number(e.target.value) })} required />
                </label>
                <label>
                  Height
                  <input type="number" min="1" value={account.height} onChange={(e) => setAccount({ ...account, height: Number(e.target.value) })} required />
                </label>
              </>
            )}

            <button className="primary-button" type="submit">
              {mode === 'login' ? 'Login' : 'Create Account'}
            </button>
          </form>
        </section>
      ) : (
        <section className="dashboard">
          <aside className="profile-panel">
            <p className="eyebrow">Current User</p>
            <h2>{user.name}</h2>
            <p>{user.age} years old · {user.weight} lb · {user.height} cm</p>
            <button className="secondary-button" onClick={() => loadUserData(user.id)}>Refresh Data</button>
          </aside>

          <section className="work-area">
            <div className="panel">
              <div className="panel-heading">
                <h2>Goal Recommendations</h2>
                <div className="inline-control">
                  <select value={selectedGoal} onChange={(e) => setSelectedGoal(e.target.value)}>
                    {goalTypes.map((goal) => (
                      <option key={goal.id} value={goal.id}>{goal.type}</option>
                    ))}
                  </select>
                  <button className="primary-button" onClick={addGoal}>Add Goal</button>
                </div>
              </div>

              <div className="table">
                <div className="table-row table-head">
                  <span>Goal</span>
                  <span>Recommended</span>
                  <span>Today</span>
                  <span>Action</span>
                </div>
                {goals.map((goal) => (
                  <div className="table-row" key={goal.goal_id}>
                    <span>{goal.type}</span>
                    <span>{goal.recommend_value}</span>
                    <span>{Math.round((progressByGoal[goal.goal_id] || 0) * 100)}%</span>
                    <button className="danger-button" onClick={() => removeGoal(goal.goal_id)}>Delete</button>
                  </div>
                ))}
                {goals.length === 0 && <p className="empty-state">No goals selected yet.</p>}
              </div>
            </div>

            <div className="panel">
              <div className="panel-heading">
                <h2>Activity Log</h2>
              </div>

              <form className="activity-form" onSubmit={saveActivity}>
                <label>
                  Activity
                  <select value={activityForm.activity} onChange={(e) => setActivityForm({ ...activityForm, activity: e.target.value })}>
                    {activities.map((activity) => (
                      <option key={activity.name} value={activity.name}>
                        {activity.name} ({activity.units})
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Amount Done
                  <input type="number" min="0" value={activityForm.amount_done} onChange={(e) => setActivityForm({ ...activityForm, amount_done: e.target.value })} />
                </label>
                <button className="primary-button" type="submit">Save Activity</button>
              </form>

              <div className="table compact">
                <div className="table-row table-head">
                  <span>Activity</span>
                  <span>Amount</span>
                  <span>Date</span>
                  <span>Action</span>
                </div>
                {dailyActivities.map((item) => (
                  <div className="table-row" key={`${item.activity}-${item.date}`}>
                    <span>{item.activity}</span>
                    <span>{item.amount_done}</span>
                    <span>{String(item.date).slice(0, 10)}</span>
                    <button className="danger-button" onClick={() => removeActivity(item.activity)}>Delete</button>
                  </div>
                ))}
                {dailyActivities.length === 0 && <p className="empty-state">No activity recorded for today.</p>}
              </div>
            </div>
          </section>
        </section>
      )}
    </main>
  );
}

export default App;
