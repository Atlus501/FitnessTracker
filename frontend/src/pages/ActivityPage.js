import React, {useState, useEffect, useContext} from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from 'axios'
import * as Yup from 'yup';
import {AuthContext} from '../helpers/AuthContext';
import {useNavigate} from 'react-router-dom';

import '../css/ActivityPage.css'
import '../App.css'

//this is the page that records the user's acivities for the day
function ActivityPage(){

    const [activities, setActivities] = useState([]);

    const navigate = useNavigate();

    const [userActivities, setUserActivities] = useState([]);
    const [error, setError] = useState();

    const {authState, setAuthState} = useContext(AuthContext);

    const handleError = (error) => {
        setError(error.response?.data?.error || "Failed to fetch activities");
    };

    const initialValues = {
        activity: (activities[0]?.name )|| "",
        amount_done: 0,
    };

    const loadUserActivities = () =>{
        if (!authState.user_id) return;

        axios.get(`http://localhost:3001/activities/${authState.user_id}`).then((response)=>{
            setUserActivities(response.data);
            setError();
        }).catch(err => handleError(err));
    }

    const onSubmit = (data, { resetForm }) => {
        const payload = {...data, user_id: authState.user_id}

        axios.post("http://localhost:3001/activities/record", payload).then(()=>{
            axios.post("http://localhost:3001/progress/updateProgress", { user_id: authState.user_id });
            loadUserActivities();
            resetForm();
            setError();
        }).catch(err => handleError(err));
    };

    const validationSchema = Yup.object().shape({
        activity: Yup.string().oneOf(activities.map(a => a.name), "please select one of the options").required("Required"),
        amount_done: Yup.number().integer().min(0).required("Required"),
    });

    const removeActivity = (data) => {
        axios.delete("http://localhost:3001/activities/remove",
            {params: {user_id: authState.user_id, activity: data.activity}}).then(() =>{
                axios.post("http://localhost:3001/progress/updateProgress", { user_id: authState.user_id });
                loadUserActivities();
                setError();
            }).catch(err => handleError(err));
    }

    useEffect(() => {
        axios.get("http://localhost:3001/activities").then((response)=>{
            setActivities(response.data);
            setError();
            loadUserActivities();
        }).catch(err => handleError(err));
    }, [authState.user_id]);

    return <>
    <div classname="container">
        <button className="primary-button" onClick={()=>{
            setAuthState({user_id: 0, username: ""});
            navigate("/");
        }}>Sign out</button>

        <button className="primary-button" onClick={() => {
            navigate("/goals");
        }}>Go back to see goals</button>
    </div>

    <div className="container">
        <Formik enableReinitialize={true} initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
            <Form className="form">

                <label>Select one of the following activities</label>
                <Field className="content" name="activity" as="select">
                    {
                        activities.map((data) => {
                            const activity = data.name;
                            return <option key={activity} value={activity}>{activity +" ("+data.units+")"}</option>
                        })
                    }
                </Field>

                <label>Enter the amount that you've done this activity today</label>
                <Field name="amount_done" className="content" type="number"/>

                <ErrorMessage className = "error" name="amount_done" component="span" />
                <span className = "error">{error}</span>

                <button name="submit" type="submit" className="submit">Record or update an activity</button>
            </Form>
        </Formik>
    </div>


    <div className="container">
        <span>Here are your activities for today</span>
    </div>

        {
            userActivities.map((userActivity)=>{

                return<div className="container" key={userActivity.activity}>
                    <span>Activity done: {userActivity.activity}</span>
                    <span>Amount done: {userActivity.amount_done}</span>
                    <button className="delete" onClick={() => {removeActivity(userActivity)}}>Delete activity</button>
                </div>
            })    
        }
        
    </>;
};

export default ActivityPage;