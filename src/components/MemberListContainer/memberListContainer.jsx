import React, {useState, useEffect} from "react";
import MemberList from "../MemberList/memberList.jsx";
import { fetchClanMembersData } from "../../Services/ConnectAPI.js";

function MemberListContainer() {
    const [members, setMembers] = useState([]);

    useEffect(() => {
        async function fetchMembers() {
            try {
                const response = await fetchClanMembersData();
                setMembers(response.items); 
            } catch (error) {
                console.error('Error fetching members:', error);
            }
        }

        fetchMembers();
    }, []);

    return <MemberList members={members} />
};


export default MemberListContainer;