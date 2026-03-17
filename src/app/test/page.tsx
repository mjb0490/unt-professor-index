import { getProfessorsBySearch } from "../actions/professor-actions";

export default async function TestPage() {
    const data = await getProfessorBySearch("a");

    return (
        <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
            <h1>🔍 Drizzle Connection Test</h1>
            <hr />
      
            {data.length > 0 ? (
                <div>
                    <p style={{ color: "green", fontWeight: "bold" }}>
                        ✅ Success! Connected to Neon.
                    </p>
                    <p>Found {data.length} professors matching 'a'.</p>
                    <pre style={{ background: "#f4f4f4", padding: "1rem" }}>
                        {JSON.stringify(data[0], null, 2)}
                    </pre>
                </div>
            ) : (
                <div>
                    <p style={{ color: "orange" }}>
                        ⚠️ Connected, but no data found. 
                    </p>
                    
                </div>
            )}
        </div>
    );
}