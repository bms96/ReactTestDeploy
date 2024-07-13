import { useState } from "react";

interface NutritionEntry {
    id: number
    description: string;
    calories: number;
    protein: number;
}

export default function NutritionTracker() {

    const [nutritionEntries, setNutritionEntries] = useState<NutritionEntry[]>([]);

    const [enteredDescription, setEnteredDescription] = useState<string>("");
    const [enteredCalories, setEnteredCalories] = useState<number>(0);
    const [enteredProtein, setEnteredProtein] = useState<number>(0);

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
        setNutritionEntries([...nutritionEntries, newEntry]);
    }

    function handleDeleteEntryClick(id: number) {
        setNutritionEntries([...nutritionEntries.filter(entry => entry.id != id)])
    }

    function TableSummary() {
        const totalCalories = nutritionEntries.reduce((total, entry) => total + entry.calories, 0)
        const totalProtein = nutritionEntries.reduce((total, entry) => total + entry.protein, 0)
        return <>
            <p><b>Total Calories:</b> {totalCalories}</p>
            <p><b>Total Protein:</b> {totalProtein}</p>
        </>
    }

    return (
        <>

            <TableSummary />
            <ul>
                {nutritionEntries.map((entry, index) => (
                    <li key={index}>
                        <b>Description:</b> {entry.description}, <b>Calories:</b> {entry.calories}, <b>Protein:</b> {entry.protein}
                        <button style={{ marginLeft: "1rem"}} onClick={() => handleDeleteEntryClick(entry.id)}>Delete</button>
                        <hr />
                    </li>
                ))}
            </ul>
            <label>
                <b>Description</b> <input name="description" value={enteredDescription} onChange={e => handleDescriptionChange(e.target.value)} />
            </label>
            <br />
            <label>
                <b>Calories</b> <input name="calories" value={enteredCalories} onChange={e => handleCaloriesChange(e.target.value)} pattern="\d*" />
            </label>
            <br />
            <label>
                <b>Protein</b> <input name="protein" value={enteredProtein} onChange={e => handleProteinChange(e.target.value)} pattern="\d*" />
            </label>
            <br />
            <br />
            <button onClick={() => handleAddEntryClick(enteredDescription, enteredCalories, enteredProtein)}>Add Entry</button>
        </>
    );

}