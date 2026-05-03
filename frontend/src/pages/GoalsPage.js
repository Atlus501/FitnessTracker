import React, {useState, useEffect, useContext, useMemo} from 'react'
import axios from 'axios'
import {AuthContext} from '../helpers/AuthContext.js'
import {useNavigate} from 'react-router-dom'

import '../App.css'

function GoalsPage(){

    const {authState, setAuthState} = useContext(AuthContext);
    const navigate = useNavigate();

     const clearMessages = () => {
        setNotice('');
        setError('');
    };

    const [user, setUser] = useState({});

    const [goalTypes, setGoalTypes] = useState([]);
    const [goals, setGoals] = useState([]);

    const [error, setError] = useState('');

    const [progress, setProgress] = useState([]);
    const [selectedGoal, setSelectedGoal] = useState('');

    const [notice, setNotice] = useState('');

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

    useEffect(() => {

        if (!authState.user_id) navigate("/");

        getUser();
        loadUserData(authState.user_id);

        axios.get(`${API_URL}/goals`).then((res) => {
            setGoalTypes(res.data);
            if (res.data[0]) setSelectedGoal(String(res.data[0].id));
        }).catch(() => {})

    }, [API_URL, authState.user_id]);

    const addGoal = async () => {
    if (!authState.user_id || !selectedGoal) return;
    clearMessages();

    try {
      await axios.post(`${API_URL}/goals/record_goal`, {
        user_id: authState.user_id,
        goal_id: Number(selectedGoal),
      });
      await loadUserData(authState.user_id);
      setNotice('Goal saved with a personalized recommendation.');
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save goal.');
      console.log(err);
    }
  };

  const removeGoal = async (goalId) => {
    clearMessages();

    try {
      await axios.delete(`${API_URL}/goals/remove_goal`, {
        params: { user_id: authState.user_id, goal_id: goalId },
      });
      await loadUserData(authState.user_id);
      setNotice('Goal removed.');
    } catch (err) {
      setError(err.response?.data?.error || 'Could not remove goal.');
    }
  };

const progressByGoal = useMemo(() => {
  const map = {};
  progress.forEach((item) => {
    map[item.goal_id] = Number(item.daily_progress);
  });
  return map;
}, [progress]);


const loadUserData = async (userId) => {
    const [goalsResponse, progressResponse] = await Promise.all([
      axios.get(`${API_URL}/goals/${userId}`),
      axios.get(`${API_URL}/progress/${userId}`),
    ]);

    setGoals(goalsResponse.data);
    setProgress(progressResponse.data);
};

  const getUser = () => {
    axios.get(`${API_URL}/users/${authState.user_id}`).then((response) => {
        setUser(response.data);
    });;
  }

  const seeActivityLog = () => {
    navigate('/activity');
  };

  const signOut = () => {
    setAuthState({user_id: 0, username: ""});
    localStorage.removeItem("fitness-user");
    navigate('/');
  };

    return (<section className="dashboard">
          <aside className="profile-panel">
            <p className="eyebrow">Current User</p>
            <h2>{user.name}</h2>
            <p>{user.age} years old · {user.weight} lb · {user.height} cm</p>
            <button className="secondary-button" onClick={() => loadUserData(authState.user_id)}>Refresh Data</button>
            <button className="primary-button" onClick={() => {signOut()}}>Sign out</button>

            <span>{notice}</span>
            <span>{error}</span>
            
          </aside>

          <section className="work-area">
            <div className="panel">
              <div className="panel-heading">
                <h2>Goal Recommendations</h2>
                <div className="inline-control">
                  <select value={selectedGoal} onChange={(e) => setSelectedGoal(e.target.value)}>{
                    goalTypes.map((goal) => (
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
                <button className="primary-button" onClick={() => {seeActivityLog()}}>See Activity Log</button>
                </div>
            </div>
          </section>
        </section>);
}

export default GoalsPage;