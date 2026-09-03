function App() {

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-16 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-5">To Do List</h1>

        <form onSubmit={handleSubmit} className="flex gap-2 mb-5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tulis tugas baru..."
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-600">
            Tambah
          </button>
        </form>
        
        <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 mt-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => onToggle(todo.id)}
              className="w-4 h-4 accent-indigo-500"
            />
            <span
              className="text-sm text-gray-700"
            >
              Ini task
            </span>
          </label>

          <button
            onClick={() => onDelete(todo.id)}
            className="text-gray-300 hover:text-red-500 text-sm"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;