import  { useState, useEffect } from 'react';
import {  useLocation } from "react-router-dom";



function CharacterView() {

    const [characterData, setCharacterData] = useState({})
    const [films, setFilms] = useState([]);
    const [ starships, setStarships] = useState([]);
    const [ species, setSpecies] = useState('');


    
    const location = useLocation();

    console.log(location)

    const characterNumber = location.pathname.split('/')[2];

    const getFilmData = ( filmAPI) => {
        fetch(filmAPI).then((res) => res.json()).then(data => 
            {return data.title})
    }

    const getStarshipData = ( starshipAPI) => {
        fetch(starshipAPI).then((res) => res.json()).then(data => 
            {return data.name})
    }

    useEffect(() => {

        fetch(`https://swapi.py4e.com/api/people/${characterNumber}/`).then((res) => res.json()).then((data) => {
            let tempCharacterData = characterData;

        tempCharacterData.name = data.name;
        if(data.species[0]){
            fetch(data.species[0]).then((res) => res.json()).then(data2 => {
                setSpecies(data2.name)
            })
        }

        let filmMap = JSON.parse(localStorage.getItem('filmMap')) || {}

        data.films.map(filmLink => {
            const filmNumber = filmLink.split('/')[5];
            if(!filmMap[filmNumber]){
                 fetch(filmLink).then(resp => resp.json()).then( data => {
                    filmMap[filmNumber] = data.title;
                }).then(() => {
                    if(Object.keys(filmMap).length === data.films.length){
                        localStorage.setItem('filmMap', JSON.stringify(filmMap))
                    }
                })
            }
        })

        let starshipMap = JSON.parse(localStorage.getItem('starshipMap')) || {}
        console.log(data)
        data.starships.map(ssLink => {
            const ssNum = ssLink.split('/')[5];
            console.log(1)
            
            if(!starshipMap[ssLink]){
                console.log(2)

                 fetch(ssLink).then(resp => resp.json()).then( data => {
                    starshipMap[ssNum] = data.name;
                }).then(() => {
                    console.log(3)

                    if(Object.keys(starshipMap).length === data.starships.length){
                        localStorage.setItem('starshipMap', JSON.stringify(starshipMap))
                    }
                })
            }
        })

        tempCharacterData.films = data.films;
        tempCharacterData.starships = data.starships;
        
        
        setCharacterData(tempCharacterData)
        })
       

    },[])


    const filmMap =JSON.parse( localStorage.getItem('filmMap'));
    const starshipMap =JSON.parse( localStorage.getItem('starshipMap'));


    return ( <> View
    <div>{characterData.name}</div>
    <div>{species}</div>
    <div> { characterData.films && characterData.films.map(item => {return (<>{filmMap[item.split('/')[5]]}</>)})} </div>
    <div> { characterData.starships && characterData.starships.map(item => {return (<>{starshipMap[item.split('/')[5]]}</>)})} </div>



    
    </> );
}

export default CharacterView;