import { useState } from "react";

interface NutritionEntry {
    id: number
    description: string;
    calories: number;
    protein: number;
}

export default function NutritionTracker() {
    const [nutritionEntries, setNutritionEntries] = useState<NutritionEntry[]>([]);

    function handleAddEntryClick() {
        const newId = nutritionEntries?.length == 0 ? 1 : nutritionEntries[nutritionEntries.length - 1].id + 1;
        const newEntry: NutritionEntry = { id: newId, description: "Example", calories: 100, protein: 10 };
        setNutritionEntries([...nutritionEntries, newEntry]);
    }

    function handleDeleteEntryClick(id: number) {
        setNutritionEntries([...nutritionEntries.filter(entry => entry.id != id)])
    }

    return (
        <>
            
            <TableSummary />
            <ul>
                {nutritionEntries.map((entry, index) => (
                    <li key={index}>
                        Id: {entry.id} Description: {entry.description}, Calories: {entry.calories}, Protein: {entry.protein}
                        <button style={{marginLeft: "1rem"}} onClick={() => handleDeleteEntryClick(entry.id)}>Delete</button>
                        <hr />
                    </li>
                ))}
            </ul>
            <button onClick={handleAddEntryClick}>Add Entry</button>
        </>
    );

    function TableSummary() {
        const totalCalories = nutritionEntries.reduce((total, entry) => total + entry.calories, 0)
        const totalProtein = nutritionEntries.reduce((total, entry) => total + entry.protein, 0)
        return <>
            <p>Total Calories: {totalCalories}</p>
            <p>Total Protein: {totalProtein}</p>
        </>
    }
}