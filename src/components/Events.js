import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import TodayIcon from '@material-ui/icons/Today';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
import CodeIcon from '@material-ui/icons/Code';
import VideocamIcon from '@material-ui/icons/Videocam';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import EventCard from './EventCard';
import ReactPaginate from 'react-paginate';
import NoEventsCard from './NoEventsCard.js'
import '../styles/events.css'

let selectedTags = localStorage.getItem('selectedTags')?JSON.parse(localStorage.getItem('selectedTags')):[];
const Events = () => {
    const URL_tags = 'https://api.codingninjas.com/api/v3/event_tags/';
    const URL_events = 'https://api.codingninjas.com/api/v3/events?'
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(<div className="loader"></div>);
    const [loading_msg, setLoading_msg] = useState(<p className="loading_msg">Loading...</p>)
    const [category, setCategory] = useState('ALL_EVENTS');
    const [subcategory, setSubcategory] = useState('Upcoming');
    const [numOfTags, setNumOfTags] = useState(0);
    const [loading_events, setLoading_events] = useState(<div className="loader"></div>);
    const [events, setEvents] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [numOfEvents, setNumOfEvents] = useState(5);
    const [pageCount, setPageCount] = useState(0);
    const [noEvent, setNoEvent] = useState('');
    const tag_ref = useRef();
    const [loading_events_msg, setLoading_events_msg] = useState(<p className="loading_events_msg">Loading...</p>);
    let start = 0;
    let end = numOfEvents;

    useEffect(() => {
        axios.get(URL_tags)
        .then((res) => {
            let arr = res.data.data.tags; 
            setTags(arr);
            setLoading('');
            setLoading_msg('');
        });
        return () => {
            setTags([]);
        }
    }, []);

    const handle_subcategory = e => {
        setSubcategory(e.target.innerText);
    }


    const handle_category = e => {
        console.log(e);
        setCategory(e.target.id);
    }

    const handleTags = e => {
        let tagClicked = e.target.innerText;
        if(selectedTags.includes(tagClicked)) {
            let index = -1;
            for(let j=0;j<selectedTags.length;j++) {
                if(selectedTags[j]===tagClicked) {
                    index = j;
                }
            }
            selectedTags.splice(index,1);
            e.target.style.background = 'rgba(183, 116, 238, 0.164)';
            e.target.style.color = 'black'
        } else {
            selectedTags.push(tagClicked);
            e.target.style.background = '#2b2eff';
            e.target.style.color = 'white';
        }
        localStorage.setItem('selectedTags',JSON.stringify(selectedTags));
        numOfTags?setNumOfTags(0):setNumOfTags(1);
    }

    const changePage = ({ selected }) => {
        setPageNumber(selected);
    }

    const changeNumofPages = e => {
        setNumOfEvents(e.target.value);
    }

    const clearAllTags = () => {
        let len = tags.length;
        let len_of_selected = selectedTags.length;
        if(!len_of_selected) return;
        for(let i=0;i<len;i++) {
            tag_ref.current.children[i].style.background = 'rgba(183, 116, 238, 0.164)';
            tag_ref.current.children[i].style.color = 'black'
        }
        selectedTags = [];
        localStorage.setItem('selectedTags',[]);
        numOfTags?setNumOfTags(0):setNumOfTags(1);
        setEvents([]);
        setPageNumber(0);
        setLoading_events(<div className="loader"></div>);
        setLoading_events_msg(<p className="loading_events_msg">Loading...</p>);
    }

    useEffect(() => {
        let len = tags.length;
        for(let i=0;i<len;i++) {
            let Tag = tag_ref.current.children[i].innerText;
            console.log(Tag);
            if(selectedTags.includes(Tag)) {
                console.log(tag_ref.current.children[i]);
                tag_ref.current.children[i].style.background = '#2b2eff';
                tag_ref.current.children[i].style.color = 'white';
            }
        }   
    }, [tags]);

    useEffect(() => {
        setEvents([]);
        setNoEvent('');
        setLoading_events(<div className="loader"></div>);
        setLoading_events_msg(<p className="loading_events_msg">Loading...</p>);
        const offset = pageNumber*numOfEvents;
        const data = {
            "event_category":category,
            "event_sub_category":subcategory,
            "tag_list":[...selectedTags],
            "offset":offset
        }
        let url = URL_events + `event_category=${data.event_category}&event_sub_category=${data.event_sub_category}&tag_list=`;
        let tag_list_string = "";
        data.tag_list.forEach(tag => {
        tag_list_string += `${tag},`; 
        });
        let req_tag_list = tag_list_string.slice(0,tag_list_string.length-1);
        url = url + req_tag_list;
        let tempURL = url;
        url = url + `&offset=${data.offset}`;
        console.log(url);
        axios.get(url)
        .then(res => {
            setEvents(res.data.data.events);
            setNoEvent(<NoEventsCard/>);
            let off = (res.data.data.page_count-1)*20;
            tempURL = tempURL+`&offset=${off}`;
            axios.get(tempURL)
            .then(res => {
                let len = res.data.data.events.length;
                off+=len;
                let number_of_pages = Math.ceil(off/numOfEvents);
                setPageCount(number_of_pages);
            })
            setLoading_events('');
            setLoading_events_msg('');
        })
    }, [numOfTags, category, subcategory, pageNumber, numOfEvents]);

    useEffect(() => {
        setPageNumber(0);
    }, [numOfTags, category, subcategory, numOfEvents])

    return (
        <div className='app'>
            <img src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y29kZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80" className="bkg_img" alt="bkg-img"/>
            <h1 className="title">Events</h1>
            <div className="category_card">
                <ul className="event_category">
                    <li>
                        <input type="radio" id="all_events" name="event_category" value="all_events" defaultChecked />
                        <label onClick={handle_category} id="ALL_EVENTS" value="ALL_EVENTS" className="ev_c" for="all_events"><TodayIcon fontSize='medium'/>All Events</label>
                    </li>
                    <li>
                        <input type="radio" id="webinars" name="event_category" value="webinars"/>
                        <label onClick={handle_category} id="WEBINAR" className="ev_c" for="webinars"><OndemandVideoIcon fontSize='medium'/>Webinars</label>
                    </li>
                    <li>
                        <input type="radio" id="coding_events" name="event_category" value="coding_events"/>
                        <label onClick={handle_category} id="CODING_EVENT" className="ev_c" for="coding_events"><CodeIcon fontSize='medium'/>Coding Events</label>
                    </li>
                    <li>
                        <input type="radio" id="bootcamp" name="event_category" value="bootcamp"/>
                        <label onClick={handle_category} id="BOOTCAMP_EVENT" value="BOOTCAMP_EVENT" className="ev_c" for="bootcamp"><GroupWorkIcon fontSize='medium'/>Bootcamp Event</label>
                    </li>
                    <li>
                        <input type="radio" id="workshop" name="event_category" value="workshop"/>
                        <label onClick={handle_category} id="WORKSHOP" className="ev_c" for="workshop"><VideocamIcon fontSize='medium'/>Workshop</label>
                    </li>
                </ul>
            </div>
            <div className="subcategory_card">
                <ul className="event_subcategory">
                    <li>
                        <input type="radio" id="upcoming" name="event_subcategory" value="upcoming" defaultChecked />
                        <label onClick={handle_subcategory} className="ev_sc" for="upcoming">Upcoming</label>
                    </li>
                    <li>
                        <input type="radio" id="archived" name="event_subcategory" value="archived"/>
                        <label onClick={handle_subcategory} className="ev_sc" for="archived">Archived</label>
                    </li>
                    <li>
                        <input type="radio" id="atf" name="event_subcategory" value="atf"/>
                        <label onClick={handle_subcategory} className="ev_sc" for="atf">All Time Favorites</label>
                    </li>
                </ul>
            </div>
            <div className="event_tag_container">
                <div className="events_list">
                    {loading_events}
                    {loading_events_msg}
                    {
                        events.length?events.slice(start,end).map((event,index) => <EventCard key={index} eventDetails={event}/>):
                        noEvent
                    }
                    <div className="pages">
                        <select name="pagenum" onChange={changeNumofPages} className="pagenum">
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                        </select>
                        <ReactPaginate 
                            previousLabel={"Prev"}
                            nextLabel={"Next"}
                            pageCount={pageCount}
                            onPageChange={changePage}
                            containerClassName={"paginationbtn"}
                            previousLinkClassName={"arrow-left"}
                            nextLinkClassName={"nextbtn"}
                            activeClassName={"activebtn"}
                            forcePage={pageNumber}
                        /> 
                    </div>
                </div>
                <div className="tags_list">
                    <div className="tags_heading">
                        <div className="tag">Tags</div>
                        <div className="clear_tags" onClick={clearAllTags}>Clear All Tags</div> 
                    </div>
                    <div ref={tag_ref} className="tags">
                        {loading}
                        {loading_msg}
                        {
                            tags.map(tag=>{
                                return (
                                    <div key={tag} className="tag_box" onClick={handleTags} value={tag}>
                                        {tag}
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Events
