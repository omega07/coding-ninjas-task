import React from 'react';
import '../styles/event_card.css';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import Threedots from 'react-three-dots';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom"

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

const EventCard = (eventDetails) => {
    const classes = useStyles();
    const history = useHistory();
    let d = new Date(eventDetails.eventDetails.registration_end_time*1000);
    let time = d.toLocaleTimeString(navigator.language, {
        hour: '2-digit',
        minute:'2-digit'
    });
    let dd = new Date(eventDetails.eventDetails.event_start_time*1000);
    let start_time = dd.toLocaleTimeString(navigator.language, {
        hour: '2-digit',
        minute:'2-digit'
    });
    let st = eventDetails.eventDetails.event_start_time*1000, et = eventDetails.eventDetails.event_end_time*1000
    let date = d.toDateString();
    let start_date = dd.toDateString();
    let venue = eventDetails.eventDetails.venue;
    let currency = eventDetails.eventDetails.currency, fee = eventDetails.eventDetails.fees;
    let overview = eventDetails.eventDetails.short_desc?Threedots(eventDetails.eventDetails.short_desc,170):"";
    let x = new Date();
    let curr_time = x.getTime();
    let running = (curr_time>=st && curr_time<=et?true:false);
    let past_event = (curr_time>et?true:false);
    let show_users_count = eventDetails.eventDetails.registered_users.show_users_count;
    let other_users = eventDetails.eventDetails.registered_users.other_users_count;
    let end_date = new Date(et).toDateString();
    let end_time = new Date(et).toLocaleTimeString(navigator.language, {
        hour: '2-digit',
        minute:'2-digit'
    });

    const handleCheckout = () => {
        history.push('/checkout');
    }

    const handleEventPage = () => {
        localStorage.setItem('event',JSON.stringify(eventDetails.eventDetails));
        history.push('/event');
    }

    return (
        <div className="card" onClick={handleEventPage}>
            <div className="event_card">
                <div className="img_outer_div">
                    <div className="img_div">
                        <img className="cover_img" src={eventDetails.eventDetails?.mobile_cover_picture} alt={eventDetails.eventDetails?.name}/>
                        {past_event?"":
                            <div className="registrations">
                                <AnnouncementIcon fontSize='small' className="announce_icon"/>
                                <p className="reg_para">Registrations <strong>open</strong> till <strong>{date} {time}</strong></p>
                            </div>
                        }
                    </div>
                    <div className="avatar_div">
                        {
                            eventDetails.eventDetails.registered_users.top_users.map((user,index) => {
                                return (<Avatar key={index} src={user.image_url} title={user.name} className={classes.small} id="avatar"/>);
                            })
                        }
                    </div>
                    <div className="other_users">{show_users_count?<p>and <strong>{other_users}</strong> others registered</p>:``}</div>
                </div>
                <div className="left_side">
                    <h2 className="event_name">{eventDetails.eventDetails?.name}</h2>
                    <div className="details">
                        <div className="time">
                            {
                                past_event?<p>Ended on <strong><br/>{end_date}<br/> {end_time}</strong></p>:(running?<p className="ending_event">Ends on <strong><br/>{end_date}<br/> {end_time}</strong></p>:<p className="starting_event">Starts on <strong><br/>{start_date}<br/> {start_time}</strong></p>)
                            }
                        </div>
                        <div className="fee">Entry<br/> Fee <strong><br/>{currency} {fee}</strong></div>
                        <div className="venue">Venue<br/><strong>{venue}</strong></div>
                    </div>
                    <div className="overview">
                        {overview}
                    </div>
                </div>
            </div>
            {past_event?"":<div className="reg_run_btn" onClick={handleCheckout}>{running?"Running...":"Register"}</div>}
        </div>
    )
}

export default EventCard
