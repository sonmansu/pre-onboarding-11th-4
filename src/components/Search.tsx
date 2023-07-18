import React, { useRef, useState } from 'react';
import { searchAPI } from '../apis/search';
import { ReactComponent as SearchIcon } from '../assets/search.svg';
import { Sick } from '../utils/types';

const EXPIRE_TIME = 20 * 1000;

const isEmptyObject = (obj: object): boolean => {
  return Object.keys(obj).length === 0;
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
        // console.log('expire time 만료, 캐시 비움');
        cache.current = {};
      }, EXPIRE_TIME);
    }

    if (cache.current[input]) {
      setRecommends(cache.current[input]);
      return;
    }

    try {
      const result = await searchAPI(input);
      console.info('calling api');

      if (result.length === 0) {
        result.push({ sickCd: '-1', sickNm: '검색어 없음' });
      }

      cache.current[input] = result;
      setRecommends(result);
    } catch (error) {
      console.log('error :>> ', error);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) return;

    switch (event.key) {
      case 'ArrowUp':
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
