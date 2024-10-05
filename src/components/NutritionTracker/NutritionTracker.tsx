import { useState } from "react";

interface NutritionEntry {
    id: number
    description: string;
    calories: number;
    protein: number;
}

export default function NutritionTracker() {

    //localStorage.setItem("testVal", "123");
    const previousEntries: NutritionEntry[] = JSON.parse(localStorage.getItem("entries") ?? "") ?? [];
    const [nutritionEntries, setNutritionEntries] = useState<NutritionEntry[]>(previousEntries);

    const [enteredDescription, setEnteredDescription] = useState<string>("");
    const [enteredCalories, setEnteredCalories] = useState<number>(0);
    const [enteredProtein, setEnteredProtein] = useState<number>(0);

    var inputStyle = {borderRadius: "0.25rem"}

    function handleDescriptionChange(newVal: string) {
        setEnteredDescription(newVal);
    }

    function handleCaloriesChange(newVal: string) {
        setEnteredCalories(parseInt(newVal));
    }

    function handleProteinChange(newVal: string) {
        setEnteredProtein(parseInt(newVal));
    }

    function handleAddEntryClick(description: string, calories: number, protein: number) {
        const newId = nutritionEntries?.length == 0 ? 1 : nutritionEntries[nutritionEntries.length - 1].id + 1;
        const newEntry: NutritionEntry = { id: newId, description: description, calories: calories, protein: protein };

        const newEntriesList: NutritionEntry[] = [...nutritionEntries, newEntry];

        setNutritionEntries(newEntriesList);
        localStorage.setItem("entries", JSON.stringify(newEntriesList));
    }

    function handleDeleteEntryClick(id: number) {
        const newEntriesList: NutritionEntry[] = [...nutritionEntries.filter(entry => entry.id != id)];
        setNutritionEntries(newEntriesList)
        localStorage.setItem("entries", JSON.stringify(newEntriesList));
    }

    function TableSummary() {
        const CALORIES_TO_LOSE_ONE_POUND: number = 1731;
        const CALORIES_TO_LOSE_TWO_POUNDs: number = 1231;
        const PROTEIN_GOAL: number = 128;

        const totalCalories = nutritionEntries.reduce((total, entry) => total + entry.calories, 0)
        const totalProtein = nutritionEntries.reduce((total, entry) => total + entry.protein, 0)

        var isWithinAtCalorieGoal: boolean = totalCalories >= CALORIES_TO_LOSE_ONE_POUND && totalCalories <= CALORIES_TO_LOSE_TWO_POUNDs;
        var isAboveCalorieGoal: boolean = totalCalories > CALORIES_TO_LOSE_ONE_POUND;
        var isAtProteinGoal: boolean = totalProtein >= PROTEIN_GOAL;

        var calorieGoalStyle = stylingForCalorieGoal(isWithinAtCalorieGoal, isAboveCalorieGoal);
        var proteinGoalStyle = stylingForProteinGoal(isAtProteinGoal);

        return <>
            <p style={calorieGoalStyle}><b>Total Calories:</b> {totalCalories}</p>
            <p style={proteinGoalStyle}><b>Total Protein:</b> {totalProtein}</p>
        </>
    }

    return (
        <>
            <TableSummary />
            <label>
                <b>Description</b> <input style={inputStyle} name="description" value={enteredDescription} onChange={e => handleDescriptionChange(e.target.value)} />
            </label>
            <br />
            <label>
                <b>Calories</b> <input style={inputStyle} type="number" name="calories" value={enteredCalories} onChange={e => handleCaloriesChange(e.target.value)} />
            </label>
            <br />
            <label>
                <b>Protein</b> <input style={inputStyle} type="number" name="protein" value={enteredProtein} onChange={e => handleProteinChange(e.target.value)} />
            </label>
            <br />
            <br />
            <button onClick={() => handleAddEntryClick(enteredDescription, enteredCalories, enteredProtein)}>Add Entry</button>
            <ul>
                {nutritionEntries.map((entry, index) => (
                    <li key={index}>
                        <b>Description:</b> {entry.description}, <b>Calories:</b> {entry.calories}, <b>Protein:</b> {entry.protein}
                        <button style={{ marginLeft: "1rem" }} onClick={() => handleDeleteEntryClick(entry.id)}>Delete</button>
                        <hr />
                    </li>
                ))}
            </ul>
        </>
    );
}

function stylingForCalorieGoal(isWithinAtCalorieGoal: boolean, isAboveCalorieGoal: boolean) {
    if (isWithinAtCalorieGoal) {
        return {
            color: 'green',
        };
    } else if (isAboveCalorieGoal) {
        return {
            color: 'red',
        };
    }
    else {
        return {
            color: 'yellow',
        };
    }
}

function stylingForProteinGoal(isAtProteinGoal: boolean) {
    return isAtProteinGoal ? { color: 'green' } : { color: 'yellow' }
}

