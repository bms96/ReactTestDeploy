import { useState } from "react";
import Button from '@mui/material/Button';

interface NutritionEntry {
    id: number
    description: string;
    calories: number;
    protein: number;
}

export default function NutritionTracker() {

    function getPreviousEntries(): NutritionEntry[] {
        try {
            const storedEntries = localStorage.getItem("entries");
            return storedEntries ? JSON.parse(storedEntries) : [];
        } catch (error) {
            console.error("Failed to parse entries from localStorage:", error);
            return [];
        }
    }
    const previousEntries: NutritionEntry[] = getPreviousEntries();

    const [nutritionEntries, setNutritionEntries] = useState<NutritionEntry[]>(previousEntries);

    const [enteredDescription, setEnteredDescription] = useState<string>("");
    const [enteredCalories, setEnteredCalories] = useState<number>(0);
    const [enteredProtein, setEnteredProtein] = useState<number>(0);

    var inputStyle = { borderRadius: "0.25rem", borderColor: 'black', height: '1.3rem' }

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

    function handleDuplicateEntryClick(id: number) {
        const entryToDuplicate: NutritionEntry | undefined = nutritionEntries.find(entry => entry.id == id);

        if (!entryToDuplicate) {
            console.log(`handleDuplicateEntryClick(id: ${id}) unable to duplicate entry`)
            return;
        };

        const newEntry: NutritionEntry = {
            id: createNewEntryId(),
            description: entryToDuplicate.description,
            calories: entryToDuplicate.calories,
            protein: entryToDuplicate.protein
        }

        const newEntriesList: NutritionEntry[] = [...nutritionEntries, newEntry];
        setNutritionEntries(newEntriesList)
        localStorage.setItem("entries", JSON.stringify(newEntriesList));
    }

    function createNewEntryId(): number {
        return nutritionEntries?.length == 0 ? 1 : nutritionEntries[nutritionEntries.length - 1].id + 1;
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

    function DataTable() {

        function handleInputEdit(entry: NutritionEntry, newValue: string) {

            const entryToUpdate: NutritionEntry | undefined = nutritionEntries.find(x => x.id == entry.id);

            if (!entryToUpdate) {
                console.log(`handleInputEdit(entry)\nentry: \n${JSON.stringify(entry)}\nUnable to update entry`);
                return;
            }

            entryToUpdate.description = newValue as string;
            entryToUpdate.calories = entry.calories;
            entryToUpdate.protein = entry.protein;

            const updatedEntry = [...nutritionEntries.map(e => (e.id === entry.id ? entryToUpdate : e))];

            setNutritionEntries(updatedEntry)
            localStorage.setItem("entries", JSON.stringify(updatedEntry));

        }

        const rowWidth: string = "4rem"
        const borderRadius: string = "0.5rem"
        // Header Styling
        const headerStyle = { backgroundColor: '#0d0d0c' }
        const headerTextStyle = {
            marginLeft: rowWidth,
            marginRight: rowWidth
        }

        const headerActionStyle = {
            marginLeft: rowWidth,
            marginRight: rowWidth,
            borderTopRightRadius: borderRadius
        }

        // Body Styling
        const tableBodyStyle = {
            backgroundColor: '#403f3e',
            borderRadius: borderRadius
        }

        // const tdStyle = {
        //     borderRadius: '1rem'
        // }

        const actionButtonStyle = {
            display: 'flex',
            gap: '0.5rem',
            marginRight: '0.5rem'
        }

        return <>
            <table style={{ borderCollapse: 'collapse', boxShadow: '7px 5px 8px #0d0d0c', opacity: '0.95' }}>
                <thead style={headerStyle}>
                    <tr>
                        <th style={{ marginLeft: '3rem', marginRight: '3rem', borderTopLeftRadius: borderRadius }}><p style={headerTextStyle}>Description</p></th>
                        <th><p style={headerTextStyle}>Calories</p></th>
                        <th><p style={headerTextStyle}>Protein</p></th>
                        <th style={headerActionStyle}><p style={headerTextStyle}>Actions</p></th>
                    </tr>
                </thead>
                <tbody style={tableBodyStyle}>
                    {nutritionEntries.map((entry) => (
                        <tr key={entry.id} style={{ borderBottom: '1px solid black' }}>
                            <td>
                                <input type="text" style={{
                                    borderRadius: "0.25rem",
                                    outline: 'none',
                                    border: 'none',
                                    backgroundColor: 'transparent',
                                    textAlign: 'center',
                                    height: '1.3rem'
                                }} onChange={(e) => handleInputEdit(entry, e.target.value)} defaultValue={entry.description} />
                            </td>
                            <td><p>{entry.calories}</p></td>
                            <td><p>{entry.protein}</p></td>
                            <td>
                                <div style={actionButtonStyle}>
                                    <Button variant="contained" onClick={() => handleDuplicateEntryClick(entry.id)}>Duplicate</Button>
                                    <Button variant="contained" color="error" onClick={() => handleDeleteEntryClick(entry.id)}>Delete</Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    }

    return (
        <>
            <TableSummary />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '18rem', margin: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <b>Description</b> <input style={inputStyle} name="description" value={enteredDescription} onChange={e => handleDescriptionChange(e.target.value)} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <b>Calories</b> <input style={inputStyle} type="number" name="calories" value={enteredCalories} onChange={e => handleCaloriesChange(e.target.value)} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <b>Protein</b> <input style={inputStyle} type="number" name="protein" value={enteredProtein} onChange={e => handleProteinChange(e.target.value)} />
                </div>
            </div>

            <button style={{ marginTop: '1rem' }} onClick={() => handleAddEntryClick(enteredDescription, enteredCalories, enteredProtein)}>Add Entry</button>

            <div style={{ marginTop: '1rem' }}>
                <DataTable />
            </div>


            {/* <BasicEditingGrid/> */}
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

