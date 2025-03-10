import React, { useState, useEffect } from "react";
import { Wheel } from "react-custom-roulette";
import Confetti from "react-confetti";

const RouletteWheel = () => {
  // Initialize names from localStorage or use defaults.
  const [names, setNames] = useState(() => {
    const storedNames = localStorage.getItem("rouletteNames");
    return storedNames 
      ? JSON.parse(storedNames) 
      : [{ option: "Alice" }, { option: "Bob" }, { option: "Charlie" }];
  });
  const [inputName, setInputName] = useState("");
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [winner, setWinner] = useState(null);
  
  // Set a faster spin duration (in seconds)
  const spinDuration = 0.5;

  // Save names to localStorage on change.
  useEffect(() => {
    localStorage.setItem("rouletteNames", JSON.stringify(names));
  }, [names]);

  // Add a new name.
  const handleAddName = () => {
    if (inputName.trim() !== "") {
      setNames([...names, { option: inputName.trim() }]);
      setInputName("");
    }
  };

  // Remove a name by index.
  const handleRemoveName = (index) => {
    const newNames = names.filter((_, i) => i !== index);
    setNames(newNames);
  };

  // Trigger the spin.
  const handleSpinClick = () => {
    if (names.length === 0) return;
    const newPrizeNumber = Math.floor(Math.random() * names.length);
    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);
  };

  // When the spin stops, set the winner.
  const handleStopSpinning = () => {
    setMustSpin(false);
    setWinner(names[prizeNumber].option);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-4 relative">
      {/* Winner display with confetti (positioned at the top center) */}
      {winner && !mustSpin && (
        <div className="absolute top-34 left-1/2 transform -translate-x-1/2 text-center">
          <h2 className="text-2xl font-bold bg-amber-200 p-2">Winner: {winner}</h2>
          <Confetti />
        </div>
      )}

      {/* Input and Add Button */}
      <div className="flex gap-2 m-2">
        <input
          type="text"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          placeholder="Enter a name"
          className="border p-2 rounded"
        />
        <button
          onClick={handleAddName}
          className="bg-green-500 text-white p-2 rounded"
        >
          Add Name
        </button>
      </div>

      {/* List of names with remove icon */}
      <div className="mb-4 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-1">Names:</h3>
        <ul className="flex flex-wrap gap-2">
          {names.map((n, index) => (
            <li
              key={index}
              className="border p-1 rounded bg-gray-200 flex items-center px-2"
            >
              <span>{n.option}</span>
              <button
                onClick={() => handleRemoveName(index)}
                className="ml-2 text-red-500 hover:text-red-700"
                title="Remove name"
              >
                &#x2715;
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Roulette Wheel and Spin Button */}
      <div className="flex flex-col items-center">
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={names}
          spinDuration={spinDuration}
          onStopSpinning={handleStopSpinning}
          backgroundColors={["#ff8f43", "#70bbe0", "#0b648f", "#ff8f43"]}
          textColors={["#ffffff"]}
        />
        <button
          onClick={handleSpinClick}
          className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          disabled={mustSpin}
        >
          {mustSpin ? "Spinning..." : "Spin the Wheel"}
        </button>
      </div>
    </div>
  );
};

export default RouletteWheel;
