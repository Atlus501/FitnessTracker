import React, {useState, useEffect, useContext} from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from 'axios'
import * as Yup from 'yup';
import {AuthContext} from '../helpers/AuthContext';

//this is the page that records the user's acivities for the day
function ActivityPage(){

    const [activities, setActivities] = useState([]);

    const [userActivities, setUserActivities] = useState([]);
    const [error, setError] = useState("");

    const {authState} = useContext(AuthContext);

    const initialValues = {
        activity: "",
        amount_done: 0,
    };

    const loadUserActivities = (data) =>{
        if (!authState.user_id) return;

        axios.get(`http://localhost:3001/activities/${authState.user_id}`).then((response)=>{
            setUserActivities(response.data);
        });
    }

    const onSubmit = (data, { resetForm }) => {
        const payload = {...data, user_id: authState.user_id}

        axios.post("http://localhost:3001/activities/record", payload).then(()=>{
            loadUserActivities();
            resetForm();
        });
    };

    const validationSchema = Yup.object().shape({
        activity: Yup.string().oneOf(activities.map(a => a.activity), "please select one of the options").required("Required"),
        amount_done: Yup.number().integer().min(0).required("Required"),
    });

    const removeActivity = (data) => {
        axios.delete("http://localhost:3001/activities/remove", 
            {params: {user_id: authState.user_id, activity: data.activity}}).then(() =>{
                loadUserActivities();
            });
    }

    useEffect(() => {
        axios.get("http://localhost:3001/activities").then((response)=>{
            setActivities(response.data);
        });

        loadUserActivities();
    }, []);

    return <>
        <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
            <Form className="form">

                <label>Select one of the following activities</label>
                <Field name="activity" as="select">
                    {
                        activities.map((data) => {
                            const activity = data.activity;
                            return <option key={activity} value={activity}>{activity +" ("+data.units+")"}</option>
                        })
                    }
                </Field>

                <label>Enter the amount that you've done this activity today</label>
                <Field name="amount_done" className="input"/>

                <ErrorMessage className = "error" name="amount_done" component="span" />

                <button name="submit" class>Record or update an activity</button>
                <span className = "error">{error}</span>

            </Form>
        </Formik>

        <span>Here are your activities for today</span>

        {
            userActivities.map((userActivity)=>{

                return<div key={userActivity.activity}>
                    <span>Activity done: {userActivity.activity}</span>
                    <span>Amount done: {userActivity.amount_done}</span>
                    <button onClick={() => {removeActivity(userActivity)}}>Delete activity</button>
                </div>
            })    
        }
    </>;
};

export default ActivityPage;