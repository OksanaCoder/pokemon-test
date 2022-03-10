import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";
import Grid from "./components/Grid/Grid.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { nanoid } from "nanoid";

const useInterval = (callback, delay, duration) => {
  const durationRef = useRef(duration);
  const durationIntervalRef = useRef();

  const handler = () => {
    callback(durationRef);
  };

  useEffect(() => {
    const durationInterval = setInterval(handler, delay);
    durationIntervalRef.current = durationInterval;
    return () => {
      clearInterval(durationInterval);
    };
  }, [delay]);

  return durationIntervalRef;
};

function App() {
  console.log("App is re-rendering");
  const [newGame, setNewGame] = useState(false);
  const [list, setList] = useState([]);
  const [visibleItems, setVisibleItems] = useState([]);
  const [duration, setDuration] = useState(0);
  const [finishedItems, setFinishedItems] = useState([]);
  const [winner, setWinner] = useState(false);

  const checkItems = (firstIndex, secondIndex) => {
    if (
      firstIndex !== secondIndex &&
      list[firstIndex].url === list[secondIndex].url
    ) {
      setFinishedItems([...finishedItems, firstIndex, secondIndex]);
    } else {
      setTimeout(() => {
        setVisibleItems([]);
      }, 600);
    }
  };

  useEffect(() => {
    axios.get("https://pokeapi.co/api/v2/pokemon?limit=9").then((res) => {
      console.log("res", res);
      const newList = res.data.results.map((item) => {
        return {
          id: nanoid(),
          url: item.url,
          description: item.name,
        };
      });
      setList(
        newList
          .concat(
            newList.map((item) => {
              return {
                ...item,
                id: item.id + "1",
              };
            })
          )
          .sort(() => {
            return 0.5 - Math.random();
          })
      );
    });
  }, [newGame]);

  const durationIntervalRef = useInterval(
    (durationRef) => {
      durationRef.current++;
      setDuration(durationRef.current);
    },
    1000,
    duration
  );

  useEffect(() => {
    if (finishedItems.length > 0 && finishedItems.length === list.length) {
      setWinner(true);
      clearInterval(durationIntervalRef.current);
    }
  }, [finishedItems]);

  return (
    <div className="text-center p-4 d-flex flex-column">
      <button
        onClick={() => {
          setNewGame(!newGame);
          setVisibleItems([]);
          setFinishedItems([]);
          setWinner(false);
        }}
        className="btn btn-warning mb-4"
      >
        New Game
      </button>
      {list.length === 0 ? (
        <div>...Loading</div>
      ) : (
        <div>
          <Grid
            list={list}
            visibleItems={visibleItems}
            setVisibleItems={setVisibleItems}
            finishedItems={finishedItems}
            checkItems={checkItems}
          />
          {winner && (
            <div>
              You Win !
              <br />
              Finished in {duration} seconds
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
