'use client';

import { useState, useEffect, useRef } from 'react';

type Truck = {
  id: number;
  x: number;
  y: number;
  direction: 'up' | 'down' | 'left' | 'right';
  color: string;
  cargo: Cargo[];
  maxCargo: number;
  isMoving: boolean;
  type: 'cargo' | 'tanker';
  speed: number;
  acceleration: number;
  fuel: number;
  maxFuel: number;
};

type Cargo = {
  x: number;
  y: number;
  type: 'box' | 'barrel' | 'container';
  color: string;
  weight: number;
};

type MapTile = {
  type: 'road' | 'building' | 'grass' | 'warehouse' | 'gas_station';
  rotation?: number;
  condition: 'good' | 'bad' | 'terrible';
};

export default function TruckGame() {
  const [trucks, setTrucks] = useState<Truck[]>([
    {
      id: 1,
      x: 0,
      y: 0,
      direction: 'right',
      color: 'red',
      cargo: [],
      maxCargo: 3,
      isMoving: false,
      type: 'cargo',
      speed: 0,
      acceleration: 0.1,
      fuel: 100,
      maxFuel: 100,
    },
    {
      id: 2,
      x: 4,
      y: 4,
      direction: 'left',
      color: 'blue',
      cargo: [],
      maxCargo: 3,
      isMoving: false,
      type: 'tanker',
      speed: 0,
      acceleration: 0.08,
      fuel: 100,
      maxFuel: 100,
    },
  ]);
  const [selectedTruck, setSelectedTruck] = useState<number | null>(null);
  const [cargos, setCargos] = useState<Cargo[]>([
    { x: 1, y: 1, type: 'box', color: 'bg-yellow-400', weight: 1 },
    { x: 3, y: 2, type: 'container', color: 'bg-gray-600', weight: 2 },
    { x: 2, y: 3, type: 'barrel', color: 'bg-green-500', weight: 1.5 },
  ]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [weather, setWeather] = useState<'sunny' | 'rainy' | 'foggy'>('sunny');
  const [time, setTime] = useState<'day' | 'night'>('day');
  const gameLoopRef = useRef<number>();

  // 맵 타일 정의
  const mapTiles: MapTile[][] = [
    [
      { type: 'road', rotation: 0, condition: 'good' },
      { type: 'road', rotation: 0, condition: 'bad' },
      { type: 'road', rotation: 0, condition: 'terrible' },
      { type: 'building', condition: 'good' },
      { type: 'warehouse', condition: 'good' }
    ],
    [
      { type: 'road', rotation: 90, condition: 'good' },
      { type: 'grass', condition: 'good' },
      { type: 'grass', condition: 'good' },
      { type: 'road', rotation: 0, condition: 'good' },
      { type: 'gas_station', condition: 'good' }
    ],
    [
      { type: 'road', rotation: 90, condition: 'bad' },
      { type: 'grass', condition: 'good' },
      { type: 'building', condition: 'good' },
      { type: 'road', rotation: 0, condition: 'good' },
      { type: 'road', rotation: 0, condition: 'good' }
    ],
    [
      { type: 'road', rotation: 90, condition: 'terrible' },
      { type: 'grass', condition: 'good' },
      { type: 'grass', condition: 'good' },
      { type: 'road', rotation: 0, condition: 'good' },
      { type: 'road', rotation: 0, condition: 'good' }
    ],
    [
      { type: 'warehouse', condition: 'good' },
      { type: 'road', rotation: 90, condition: 'good' },
      { type: 'road', rotation: 90, condition: 'good' },
      { type: 'road', rotation: 90, condition: 'good' },
      { type: 'building', condition: 'good' }
    ],
  ];

  const moveTruck = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (!selectedTruck) return;
    
    const truck = trucks.find(t => t.id === selectedTruck);
    if (!truck || truck.fuel <= 0) return;

    const newTrucks = trucks.map(t => {
      if (t.id === selectedTruck) {
        let newX = t.x;
        let newY = t.y;
        
        switch (direction) {
          case 'up':
            newY = Math.max(0, t.y - 1);
            break;
          case 'down':
            newY = Math.min(4, t.y + 1);
            break;
          case 'left':
            newX = Math.max(0, t.x - 1);
            break;
          case 'right':
            newX = Math.min(4, t.x + 1);
            break;
        }

        // 주유소에 도착하면 연료 충전
        if (newX === 2 && newY === 2) {
          return {
            ...t,
            x: newX,
            y: newY,
            direction,
            isMoving: true,
            fuel: t.maxFuel,
          };
        }

        return {
          ...t,
          x: newX,
          y: newY,
          direction,
          isMoving: true,
          fuel: t.fuel - 1,
        };
      }
      return t;
    });

    setTrucks(newTrucks);
  };

  // 게임 루프
  useEffect(() => {
    const gameLoop = () => {
      // 시간 변화
      setTime(prev => prev === 'day' ? 'night' : 'day');
      
      // 날씨 변화 (랜덤)
      if (Math.random() < 0.1) {
        const weathers: ('sunny' | 'rainy' | 'foggy')[] = ['sunny', 'rainy', 'foggy'];
        setWeather(weathers[Math.floor(Math.random() * weathers.length)]);
      }

      // 트럭 속도 감소
      setTrucks(trucks.map(truck => ({
        ...truck,
        speed: Math.max(0, truck.speed - 0.05)
      })));
    };

    gameLoopRef.current = window.setInterval(gameLoop, 5000);
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [trucks]);

  const handleTruckClick = (id: number) => {
    setSelectedTruck(id);
    setMessage('');
  };

  const handleDirectionClick = (direction: Truck['direction']) => {
    if (selectedTruck) {
      moveTruck(direction);
    }
  };

  const renderTruck = (truck: Truck) => {
    const directionClass = {
      up: 'rotate-0',
      right: 'rotate-90',
      down: 'rotate-180',
      left: '-rotate-90',
    }[truck.direction];

    return (
      <div className="absolute inset-0 flex items-center justify-center group">
        {/* 트럭 본체 */}
        <div className={`w-1/2 h-1/2 relative`}
             style={{
               transform: `rotate(${directionClass})`,
             }}>
          {/* 트럭 타입별 디테일 */}
          {truck.type === 'cargo' ? (
            // 화물 트럭
            <div className="absolute inset-0 flex flex-col">
              {/* 운전실 */}
              <div className="h-1/3 w-full bg-gradient-to-b from-gray-300 to-gray-400 rounded-t-lg">
                {/* 운전실 창문 */}
                <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-blue-200 opacity-50 rounded-t-lg" />
                {/* 운전실 문 */}
                <div className="absolute bottom-0 left-1/4 w-1/2 h-1/2 bg-gray-500 rounded-b-lg" />
                {/* 운전실 손잡이 */}
                <div className="absolute bottom-1/4 right-1/4 w-1/8 h-1/4 bg-gray-700 rounded-full" />
              </div>
              {/* 화물칸 */}
              <div className="h-2/3 w-full bg-gradient-to-b from-gray-400 to-gray-500 rounded-b-lg">
                {Array.from({ length: truck.cargo.length }).map((_, i) => (
                  <div key={i} className="absolute w-1/4 h-1/2 bg-gradient-to-b from-yellow-500 to-yellow-600 rounded-sm shadow-md"
                       style={{
                         top: '25%',
                         left: `${25 + i * 20}%`,
                       }}>
                    {/* 화물 디테일 */}
                    <div className="absolute inset-0 border border-yellow-700 opacity-30" />
                    <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border border-yellow-700 opacity-20" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // 탱크 트럭
            <div className="absolute inset-0 flex flex-col">
              {/* 운전실 */}
              <div className="h-1/3 w-full bg-gradient-to-b from-gray-300 to-gray-400 rounded-t-lg">
                {/* 운전실 창문 */}
                <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-blue-200 opacity-50 rounded-t-lg" />
                {/* 운전실 문 */}
                <div className="absolute bottom-0 left-1/4 w-1/2 h-1/2 bg-gray-500 rounded-b-lg" />
                {/* 운전실 손잡이 */}
                <div className="absolute bottom-1/4 right-1/4 w-1/8 h-1/4 bg-gray-700 rounded-full" />
              </div>
              {/* 탱크 */}
              <div className="h-2/3 w-full bg-gradient-to-b from-blue-500 to-blue-600 rounded-b-lg">
                {truck.cargo.length > 0 && (
                  <div className="absolute inset-0 animate-pulse" style={{ animationDuration: '2s' }}>
                    <div className="absolute inset-0 bg-blue-400 opacity-30" />
                  </div>
                )}
                {/* 탱크 디테일 */}
                <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border border-blue-700 opacity-30 rounded-full" />
                <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 border border-blue-700 opacity-20 rounded-full" />
              </div>
            </div>
          )}
        </div>

        {/* 바퀴 */}
        <div className="absolute w-1/4 h-1/4 bg-gradient-to-b from-gray-900 to-black rounded-full shadow-lg"
             style={{
               top: '37.5%',
               left: '12.5%',
               transform: `rotate(${directionClass})`,
             }}>
          {truck.isMoving && (
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '1s' }}>
              <div className="absolute w-1/4 h-1/4 bg-gray-700 rounded-full" style={{ top: '37.5%', left: '37.5%' }} />
            </div>
          )}
        </div>
        <div className="absolute w-1/4 h-1/4 bg-gradient-to-b from-gray-900 to-black rounded-full shadow-lg"
             style={{
               top: '37.5%',
               right: '12.5%',
               transform: `rotate(${directionClass})`,
             }}>
          {truck.isMoving && (
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '1s' }}>
              <div className="absolute w-1/4 h-1/4 bg-gray-700 rounded-full" style={{ top: '37.5%', left: '37.5%' }} />
            </div>
          )}
        </div>

        {/* 연료 게이지 */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-green-500 to-green-600" 
               style={{ width: `${(truck.fuel / truck.maxFuel) * 100}%` }} />
        </div>

        {/* 트럭 툴팁 */}
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 p-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
          <div>{truck.type === 'cargo' ? '화물 트럭' : '탱크 트럭'}</div>
          <div className="text-gray-400">
            <div>화물: {truck.cargo.length}/{truck.maxCargo}</div>
            <div>연료: {truck.fuel}/{truck.maxFuel}</div>
          </div>
        </div>
      </div>
    );
  };

  const renderMapTile = (tile: MapTile) => {
    return (
      <div className="w-full h-full relative group">
        {/* 배경 */}
        <div className={`absolute inset-0 ${
          tile.type === 'road' ? 'bg-gradient-to-b from-gray-800 to-gray-900' :
          tile.type === 'building' ? 'bg-gradient-to-b from-gray-900 to-black' :
          tile.type === 'warehouse' ? 'bg-gradient-to-b from-slate-300 to-slate-400' :
          tile.type === 'gas_station' ? 'bg-gradient-to-b from-yellow-700 to-yellow-800' :
          'bg-gradient-to-b from-green-800 to-green-900'
        } ${tile.condition === 'bad' ? 'opacity-90' : tile.condition === 'terrible' ? 'opacity-80' : ''}`}>
          {/* 타일별 디테일 */}
          {tile.type === 'road' && (
            <>
              <div className="absolute inset-0 bg-gray-900 opacity-30" />
              <div className="absolute w-1/4 h-full bg-yellow-600 opacity-70" 
                   style={{ transform: `rotate(${tile.rotation}deg)` }} />
              {tile.condition === 'bad' && (
                <div className="absolute w-1/3 h-1/3 border-t border-gray-600 opacity-50" 
                     style={{ top: '50%', left: '50%', transform: 'rotate(45deg)' }} />
              )}
              {tile.condition === 'terrible' && (
                <>
                  <div className="absolute w-1/2 h-1/2 bg-gray-900 rounded-full opacity-20" 
                       style={{ top: '25%', left: '25%' }} />
                  <div className="absolute w-1/3 h-1/3 border-t border-gray-600 opacity-50" 
                       style={{ top: '30%', left: '30%', transform: 'rotate(45deg)' }} />
                </>
              )}
            </>
          )}
          {tile.type === 'building' && (
            <div className="absolute inset-0 flex flex-col">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-1/3 flex">
                  {[0, 1].map((j) => (
                    <div key={j} className="w-1/2 h-full border border-gray-700 relative">
                      <div className="absolute inset-0 bg-gray-800 opacity-20" />
                      {/* 창문 */}
                      <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-blue-200 opacity-30" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
          {tile.type === 'warehouse' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-b from-slate-300 to-slate-400 relative">
                {/* 컨테이너 상단 */}
                <div className="absolute top-0 left-0 w-full h-1/4 bg-slate-200" />
                
                {/* 컨테이너 문 */}
                <div className="absolute top-1/4 left-1/4 w-1/2 h-3/4 bg-slate-300">
                  {/* 문 디테일 */}
                  <div className="absolute inset-0 border-2 border-slate-500" />
                  <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border border-slate-500" />
                  
                  {/* 손잡이 */}
                  <div className="absolute top-1/2 left-1/4 w-1/4 h-1/8 bg-slate-500 rounded-full" />
                  <div className="absolute top-1/2 right-1/4 w-1/4 h-1/8 bg-slate-500 rounded-full" />
                </div>
                
                {/* 컨테이너 측면 */}
                <div className="absolute top-1/4 left-0 w-1/4 h-3/4 bg-slate-400">
                  {/* 측면 디테일 */}
                  <div className="absolute inset-0 border-r-2 border-slate-500" />
                </div>
                <div className="absolute top-1/4 right-0 w-1/4 h-3/4 bg-slate-400">
                  {/* 측면 디테일 */}
                  <div className="absolute inset-0 border-l-2 border-slate-500" />
                </div>
                
                {/* 컨테이너 바닥 */}
                <div className="absolute bottom-0 left-0 w-full h-1/8 bg-slate-500" />
              </div>
            </div>
          )}
          {tile.type === 'gas_station' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3/4 h-3/4 bg-yellow-700 rounded-lg relative">
                {/* 주유소 건물 */}
                <div className="absolute inset-0 flex flex-col">
                  <div className="h-1/3 w-full bg-yellow-600" />
                  <div className="h-2/3 w-full bg-yellow-800" />
                </div>
                
                {/* 주유기 */}
                <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                  {/* 주유기 본체 */}
                  <div className="w-1/4 h-1/2 bg-gray-800 rounded-t-lg relative">
                    <div className="absolute top-0 left-1/2 w-1/2 h-1/4 bg-gray-700 rounded-t-lg" />
                  </div>
                  {/* 주유기 호스 */}
                  <div className="w-1/8 h-1/4 bg-gray-600 rounded-full" />
                  {/* 주유기 노즐 */}
                  <div className="w-1/8 h-1/8 bg-gray-500 rounded-full" />
                </div>
                
                {/* 주유소 표지판 */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/2 h-1/4 bg-red-600 rounded-t-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">GAS</span>
                </div>
              </div>
            </div>
          )}
          {tile.type === 'grass' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-b from-green-600 to-green-800 relative">
                {/* 잔디 패턴 */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-1 p-1">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="relative">
                      {/* 잔디 잎 */}
                      <div className="absolute top-0 left-1/2 w-1 h-2 bg-green-400 transform -translate-x-1/2" />
                      <div className="absolute top-0 left-1/2 w-1 h-2 bg-green-400 transform -translate-x-1/2 rotate-45" />
                      <div className="absolute top-0 left-1/2 w-1 h-2 bg-green-400 transform -translate-x-1/2 -rotate-45" />
                    </div>
                  ))}
                </div>
                {/* 꽃 */}
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-300 rounded-full" />
                <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-pink-300 rounded-full" />
                <div className="absolute bottom-1/4 right-3/4 w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
          )}
        </div>

        {/* 툴팁 */}
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 p-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
          {tile.type === 'road' && (
            <>
              <div>도로</div>
              <div className="text-gray-400">
                {tile.condition === 'good' ? '양호' :
                 tile.condition === 'bad' ? '불량' : '심각한 손상'}
              </div>
            </>
          )}
          {tile.type === 'building' && '건물'}
          {tile.type === 'warehouse' && '창고 (화물 적재 가능)'}
          {tile.type === 'gas_station' && '주유소 (연료 충전 가능)'}
          {tile.type === 'grass' && '잔디'}
        </div>
      </div>
    );
  };

  const renderCargo = (cargo: Cargo) => {
    return (
      <div className="w-full h-full relative">
        {cargo.type === 'box' ? (
          <div className="w-full h-full bg-gradient-to-b from-yellow-500 to-yellow-600 rounded-sm shadow-md">
            {/* 박스 디테일 */}
            <div className="absolute inset-0 border border-yellow-700 opacity-30" />
            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border border-yellow-700 opacity-20" />
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-green-500 to-green-600 rounded-full shadow-md">
            {/* 드럼통 디테일 */}
            <div className="absolute inset-0 border border-green-700 opacity-30" />
            <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 border border-green-700 opacity-20 rounded-full" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${time === 'night' ? 'bg-gray-900' : 'bg-gray-100'} py-8 relative`}>
      {/* 날씨 효과 */}
      {weather === 'rainy' && (
        <div className="absolute inset-0 bg-blue-900 opacity-20 animate-rain" />
      )}
      {weather === 'foggy' && (
        <div className="absolute inset-0 bg-gray-300 opacity-30 animate-fog" />
      )}
      
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <h1 className={`text-3xl font-bold text-center mb-8 ${time === 'night' ? 'text-white' : 'text-gray-900'}`}>
          트럭 게임
        </h1>
        
        <div className="bg-white/80 rounded-lg shadow-lg p-4 backdrop-blur-sm">
          {/* 게임 정보 */}
          <div className="mb-4 flex justify-between items-center">
            <div className="text-lg font-semibold">
              점수: {score}
            </div>
            <div className="text-sm">
              날씨: {weather === 'sunny' ? '☀️' : weather === 'rainy' ? '🌧️' : '🌫️'}
              시간: {time === 'day' ? '☀️' : '🌙'}
            </div>
            {message && (
              <div className="text-blue-600">
                {message}
              </div>
            )}
          </div>

          {/* 게임 보드 */}
          <div className="grid grid-cols-5 gap-1 bg-gray-200/50 p-1 rounded-lg">
            {mapTiles.map((row, y) => (
              row.map((tile, x) => {
                const truck = trucks.find(t => t.x === x && t.y === y);
                const cargo = cargos.find(c => c.x === x && c.y === y);
                return (
                  <div
                    key={`${x}-${y}`}
                    className={`
                      w-20 h-20 flex items-center justify-center
                      ${selectedTruck === truck?.id ? 'ring-2 ring-blue-500' : ''}
                      rounded-lg cursor-pointer relative overflow-hidden
                    `}
                    onClick={() => truck && handleTruckClick(truck.id)}
                  >
                    {renderMapTile(tile)}
                    {truck ? renderTruck(truck) : cargo ? renderCargo(cargo) : null}
                  </div>
                );
              })
            ))}
          </div>

          {/* 컨트롤 패널 */}
          <div className="mt-4 flex justify-center space-x-4">
            <button
              onClick={() => handleDirectionClick('up')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              ↑
            </button>
            <button
              onClick={() => handleDirectionClick('left')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              ←
            </button>
            <button
              onClick={() => handleDirectionClick('right')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              →
            </button>
            <button
              onClick={() => handleDirectionClick('down')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              ↓
            </button>
          </div>

          {/* 트럭 정보 */}
          <div className="mt-4 text-center">
            {selectedTruck && (
              <div className="mb-2">
                <p>선택된 트럭: {selectedTruck}</p>
                <p>화물: {trucks.find(t => t.id === selectedTruck)?.cargo.length || 0}/{trucks[0].maxCargo}</p>
                <p>연료: {trucks.find(t => t.id === selectedTruck)?.fuel || 0}/{trucks[0].maxFuel}</p>
              </div>
            )}
          </div>

          {/* 게임 설명 */}
          <div className="mt-4 text-center text-gray-600">
            <p>트럭을 클릭하여 선택한 후, 방향 버튼을 눌러 이동하세요.</p>
            <p>화물을 적재하여 점수를 획득하세요!</p>
            <p>각 트럭은 최대 {trucks[0].maxCargo}개의 화물을 운반할 수 있습니다.</p>
            <p>도로 상태에 따라 속도가 달라집니다.</p>
            <p>연료가 떨어지면 빨간색 "GAS" 표지판이 있는 주유소에서 충전하세요!</p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes move {
          0% { transform: translate(0, 0); }
          50% { transform: translate(5px, 5px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes fast {
          0% { transform: translate(0, 0); }
          50% { transform: translate(10px, 10px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes rain {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes fog {
          0% { opacity: 0.2; }
          50% { opacity: 0.4; }
          100% { opacity: 0.2; }
        }
        .animate-move {
          animation: move 0.3s ease-in-out infinite;
        }
        .animate-fast {
          animation: fast 0.2s ease-in-out infinite;
        }
        .animate-rain {
          animation: rain 1s linear infinite;
        }
        .animate-fog {
          animation: fog 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
} 