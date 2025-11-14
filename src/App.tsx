import React, { useState } from 'react';

// Definindo tipos TypeScript
type ListItem = {
  id: string;
  value: string;
};

type ComparisonResults = {
  common: string[];
  onlyInA: string[];
  onlyInB: string[];
  repeatedInA: string[];
  repeatedInB: string[];
};

function App() {
  const [listA, setListA] = useState<ListItem[]>([]);
  const [listB, setListB] = useState<ListItem[]>([]);
  const [newItemA, setNewItemA] = useState('');
  const [newItemB, setNewItemB] = useState('');
  const [results, setResults] = useState<ComparisonResults>({
    common: [],
    onlyInA: [],
    onlyInB: [],
    repeatedInA: [],
    repeatedInB: []
  });
  const [selectedItem, setSelectedItem] = useState<{ list: 'A' | 'B', id: string } | null>(null);
  const [editingItem, setEditingItem] = useState<{ list: 'A' | 'B', id: string, value: string } | null>(null);

  // Função para adicionar item na Lista A
  const addItemA = () => {
    if (newItemA.trim() === '') return;

    const item: ListItem = {
      id: Date.now().toString(),
      value: newItemA.trim()
    };

    setListA(prev => [...prev, item]);
    setNewItemA('');
  };

  // Função para adicionar item na Lista B
  const addItemB = () => {
    if (newItemB.trim() === '') return;

    const item: ListItem = {
      id: Date.now().toString(),
      value: newItemB.trim()
    };

    setListB(prev => [...prev, item]);
    setNewItemB('');
  };

  // Funções para lidar com Enter nos inputs
  const handleKeyPressA = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addItemA();
    }
  };

  const handleKeyPressB = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addItemB();
    }
  };

  // Função para selecionar um item
  const handleSelectItem = (list: 'A' | 'B', id: string) => {
    setSelectedItem({ list, id });
    setEditingItem(null);
  };

  // Função para editar um item
  const handleEditItem = (list: 'A' | 'B', id: string, currentValue: string) => {
    setEditingItem({ list, id, value: currentValue });
    setSelectedItem(null);
  };

  // Função para salvar a edição
  const handleSaveEdit = () => {
    if (!editingItem) return;

    if (editingItem.list === 'A') {
      setListA(prev =>
        prev.map(item =>
          item.id === editingItem.id
            ? { ...item, value: editingItem.value }
            : item
        )
      );
    } else {
      setListB(prev =>
        prev.map(item =>
          item.id === editingItem.id
            ? { ...item, value: editingItem.value }
            : item
        )
      );
    }

    setEditingItem(null);
  };

  // Função para cancelar a edição
  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  // Função para excluir um item
  const handleDeleteItem = (list: 'A' | 'B', id: string) => {
    if (list === 'A') {
      setListA(prev => prev.filter(item => item.id !== id));
    } else {
      setListB(prev => prev.filter(item => item.id !== id));
    }
    setSelectedItem(null);
  };

  // Função para calcular as comparações
  const compareLists = () => {
    const valuesA = listA.map(item => item.value);
    const valuesB = listB.map(item => item.value);

    // Itens comuns
    const common = valuesA.filter(value => valuesB.includes(value));

    // Itens apenas na Lista A
    const onlyInA = valuesA.filter(value => !valuesB.includes(value));

    // Itens apenas na Lista B
    const onlyInB = valuesB.filter(value => !valuesA.includes(value));

    // Itens repetidos na Lista A
    const repeatedInA = valuesA.filter((value, index, self) =>
      self.indexOf(value) !== index
    );

    // Itens repetidos na Lista B
    const repeatedInB = valuesB.filter((value, index, self) =>
      self.indexOf(value) !== index
    );

    setResults({
      common: [...new Set(common)],
      onlyInA: [...new Set(onlyInA)],
      onlyInB: [...new Set(onlyInB)],
      repeatedInA: [...new Set(repeatedInA)],
      repeatedInB: [...new Set(repeatedInB)]
    });
  };

  // Funções para limpar listas
  const clearListA = () => {
    setListA([]);
    setSelectedItem(null);
    setEditingItem(null);
    setResults({
      common: [],
      onlyInA: [],
      onlyInB: [],
      repeatedInA: [],
      repeatedInB: []
    });
  };

  const clearListB = () => {
    setListB([]);
    setSelectedItem(null);
    setEditingItem(null);
    setResults({
      common: [],
      onlyInA: [],
      onlyInB: [],
      repeatedInA: [],
      repeatedInB: []
    });
  };

  const clearAll = () => {
    setListA([]);
    setListB([]);
    setSelectedItem(null);
    setEditingItem(null);
    setResults({
      common: [],
      onlyInA: [],
      onlyInB: [],
      repeatedInA: [],
      repeatedInB: []
    });
  };

  // Componente para renderizar cada item da lista
  const renderListItem = (item: ListItem, index: number, list: 'A' | 'B') => {
    const isSelected = selectedItem?.list === list && selectedItem?.id === item.id;
    const isEditing = editingItem?.list === list && editingItem?.id === item.id;

    if (isEditing) {
      return (
        <div key={item.id} className="flex items-center justify-between py-2 px-3 border-b border-gray-100 last:border-b-0 bg-yellow-50">
          <input
            type="text"
            value={editingItem.value}
            onChange={(e) => setEditingItem({ ...editingItem, value: e.target.value })}
            className="flex-1 px-2 py-1 border border-gray-300 rounded mr-2"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleSaveEdit}
              className="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600"
            >
              ✓
            </button>
            <button
              onClick={handleCancelEdit}
              className="bg-gray-500 text-white px-2 py-1 rounded text-sm hover:bg-gray-600"
            >
              ✗
            </button>
          </div>
        </div>
      );
    }

    return (
      <div
        key={item.id}
        className={`flex items-center justify-between py-2 px-3 border-b border-gray-100 last:border-b-0 cursor-pointer ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
          }`}
        onClick={() => handleSelectItem(list, item.id)}
      >
        <span className="flex-1">{item.value}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">#{index + 1}</span>
          {isSelected && (
            <div className="flex gap-1 ml-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditItem(list, item.id, item.value);
                }}
                className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
              >
                Editar
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteItem(list, item.id);
                }}
                className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
              >
                Excluir
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-center text-gray-900">
            Comparador de Listas
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Listas lado a lado */}
        <div className="flex flex-col md:flex-row gap-8 justify-center mb-8">
          {/* Lista A */}
          <div className="flex-1 max-w-md">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-center mb-4 text-blue-600">
                Lista A ({listA.length} itens)
              </h2>

              {/* Input para adicionar item na Lista A */}
              <div className="flex mb-4">
                <input
                  type="text"
                  value={newItemA}
                  onChange={(e) => setNewItemA(e.target.value)}
                  onKeyPress={handleKeyPressA}
                  placeholder="Digite um item para Lista A"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={addItemA}
                  className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Adicionar
                </button>
              </div>

              {/* Área de itens da Lista A */}
              <div className="border border-gray-200 rounded-lg h-48 overflow-y-auto mb-4">
                {listA.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Nenhum item adicionado
                  </div>
                ) : (
                  <div>
                    {listA.map((item, index) => renderListItem(item, index, 'A'))}
                  </div>
                )}
              </div>

              {/* Botão Limpar Lista A */}
              <button
                onClick={clearListA}
                className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                Limpar Lista A
              </button>
            </div>
          </div>

          {/* Lista B */}
          <div className="flex-1 max-w-md">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-center mb-4 text-blue-600">
                Lista B ({listB.length} itens)
              </h2>

              {/* Input para adicionar item na Lista B */}
              <div className="flex mb-4">
                <input
                  type="text"
                  value={newItemB}
                  onChange={(e) => setNewItemB(e.target.value)}
                  onKeyPress={handleKeyPressB}
                  placeholder="Digite um item para Lista B"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={addItemB}
                  className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Adicionar
                </button>
              </div>

              {/* Área de itens da Lista B */}
              <div className="border border-gray-200 rounded-lg h-48 overflow-y-auto mb-4">
                {listB.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Nenhum item adicionado
                  </div>
                ) : (
                  <div>
                    {listB.map((item, index) => renderListItem(item, index, 'B'))}
                  </div>
                )}
              </div>

              {/* Botão Limpar Lista B */}
              <button
                onClick={clearListB}
                className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                Limpar Lista B
              </button>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={compareLists}
            className="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg font-semibold"
          >
            🔍 Comparar Listas
          </button>
          <button
            onClick={clearAll}
            className="bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 text-lg font-semibold"
          >
            🗑️ Limpar Tudo
          </button>
        </div>

        {/* Resultados */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Itens Iguais */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-lg mb-3 text-green-600">
              ✅ Itens Iguais ({results.common.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {results.common.length === 0 ? (
                <span className="text-gray-500 text-sm">Nenhum item em comum</span>
              ) : (
                results.common.map((item, index) => (
                  <span
                    key={index}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                  >
                    {item}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Adicionar (apenas na Lista A) */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-lg mb-3 text-yellow-600">
              ➕ Adicionar ({results.onlyInA.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {results.onlyInA.length === 0 ? (
                <span className="text-gray-500 text-sm">Nenhum item exclusivo</span>
              ) : (
                results.onlyInA.map((item, index) => (
                  <span
                    key={index}
                    className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm"
                  >
                    {item}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Excluir (apenas na Lista B) */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-lg mb-3 text-red-600">
              ❌ Excluir ({results.onlyInB.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {results.onlyInB.length === 0 ? (
                <span className="text-gray-500 text-sm">Nenhum item exclusivo</span>
              ) : (
                results.onlyInB.map((item, index) => (
                  <span
                    key={index}
                    className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm"
                  >
                    {item}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Repetidos Lista A */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-lg mb-3 text-purple-600">
              🔄 Repetidos Lista A ({results.repeatedInA.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {results.repeatedInA.length === 0 ? (
                <span className="text-gray-500 text-sm">Nenhum item repetido</span>
              ) : (
                results.repeatedInA.map((item, index) => (
                  <span
                    key={index}
                    className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                  >
                    {item}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Repetidos Lista B */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-lg mb-3 text-indigo-600">
              🔄 Repetidos Lista B ({results.repeatedInB.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {results.repeatedInB.length === 0 ? (
                <span className="text-gray-500 text-sm">Nenhum item repetido</span>
              ) : (
                results.repeatedInB.map((item, index) => (
                  <span
                    key={index}
                    className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                  >
                    {item}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;