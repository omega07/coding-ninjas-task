import React from 'react';
import '../styles/eventpage.css';
import Button from '@material-ui/core/Button';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import RoomIcon from '@material-ui/icons/Room';
import { useHistory } from "react-router-dom";


const EventPage = () => {
    const event = JSON.parse(localStorage.getItem('event'));
    const history = useHistory();
    console.log(event.cover_picture);
    let x = new Date();
    let curr_time = x.getTime();
    let running = (curr_time>=event.event_start_time*1000 && curr_time<=event.event_end_time*1000?true:false);
    let past_event = (curr_time>event.event_end_time*1000?true:false);
    let start_time = new Date(event.event_start_time*1000).toLocaleTimeString(navigator.language, {
        hour: '2-digit',
        minute:'2-digit'
    });

    let end_time = new Date(event.end_time*1000).toLocaleTimeString(navigator.language, {
        hour: '2-digit',
        minute:'2-digit'
    });

    let end_date = new Date(event.event_end_time*1000).toDateString();
    let start_date = new Date(event.event_start_time*1000).toDateString();

    const handleCheckout = () => {
        history.push('/checkout');
    }

    return (
        <div className="events">
            <img src={event.cover_picture} className="cover" alt={event.name}/>
            <h1>{event.name}</h1>
            <div className="events__event_details_outer">
                <div className="event_details">
                    <Button onClick={handleCheckout} variant="contained" color="primary">
                        {
                            past_event?"Go to Classroom":"Register"
                        }
                    </Button>
                    <div className="eventpage_time">
                        <EventAvailableIcon fontSize="small"/>
                        {
                            past_event?<p><b>Ended on</b> {end_date}, {end_time}</p>:(running?<p className="ending_event"><b>Ends on</b> {end_date}, {end_time}</p>:<p className="starting_event"><b>Starts on</b> {start_date}, {start_time}</p>)
                        }
                    </div>
                    <div className="eventpage_price">
                        <AttachMoneyIcon fontSize="small"/><b className="space_de">Price</b>:
                        {event.currency} {event.fees}
                    </div>
                    <div className="eventpage_venue">
                        <RoomIcon fontSize="small"/><b className="space_de">Venue</b>:
                        {event.venue}
                    </div>
                </div>
            </div>
            <div className="eventspage_desc">
                <h2>Description</h2><br/>
                <p>Wondering what we have in store for you this time?</p>{event.short_desc}
            </div>
        </div>
    )
}

export default EventPage
