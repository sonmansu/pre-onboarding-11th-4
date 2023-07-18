import React, { useRef, useState } from 'react';
import { searchAPI } from '../apis/search';
import { ReactComponent as SearchIcon } from '../assets/search.svg';
import { Sick } from '../utils/types';

const EXPIRE_TIME = 20 * 1000;

const isEmptyObject = (obj: object): boolean => {
  return Object.keys(obj).length === 0;
};

let lastKeyDownTime = 0;

const filterDoubleEvents = (currentTime: number) => {
  // 10ms 간격으로 이벤트 발생 시 동일 입력으로 처리
  if (currentTime - lastKeyDownTime < 10) {
    return true;
  }
  lastKeyDownTime = currentTime;
  return false;
};

export default function Search() {
  const [recommends, setRecommends] = useState<Sick[]>([]);
  const cache = useRef<{ [key: string]: Sick[] }>({});
  const [selectedIdx, setSelectedIdx] = useState(-1);

  const handleChangeInput = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const input = event.currentTarget.value;
    setSelectedIdx(-1);
    if (input === '') {
      setRecommends([]);
      return;
    }

    if (isEmptyObject(cache.current)) {
      setTimeout(() => {
        console.log('expire time 만료, 캐시 비움');
        cache.current = {};
      }, EXPIRE_TIME);
    }

    if (cache.current[input]) {
      setRecommends(cache.current[input]);
      return;
    }

    const result = await searchAPI(input);
    console.info('calling api');

    if (result.length === 0) {
      result.push({ sickCd: '-1', sickNm: '검색어 없음' });
    }

    cache.current[input] = result;
    setRecommends(result);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'ArrowUp':
        if (filterDoubleEvents(Date.now())) return;
        setSelectedIdx((prevIdx) => {
          if (prevIdx === -1) {
            return prevIdx;
          }
          if (prevIdx === 0) {
            return recommends.length - 1;
          }
          return prevIdx - 1;
        });
        break;
        return;
      case 'ArrowDown':
        if (filterDoubleEvents(Date.now())) return;
        setSelectedIdx((prevIdx) => {
          if (prevIdx === recommends.length - 1) {
            return 0;
          }
          return prevIdx + 1;
        });
        return;
        break;
      default:
        break;
    }
  };

  return (
    <div>
      검색창
      <input
        className='border-2  border-solid border-cyan-600'
        type='text'
        onChange={handleChangeInput}
        onKeyDown={handleKeyDown}
      />
      <ul>
        {recommends.map(({ sickCd, sickNm }, idx) => (
          <li
            key={sickCd}
            className={`flex items-center hover:bg-slate-300 p-2 ${
              idx === selectedIdx ? 'bg-slate-300' : ''
            }`}
          >
            <div className='w-4'>
              <SearchIcon />
            </div>
            <span className='ml-2 text-sm'>{sickNm}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
