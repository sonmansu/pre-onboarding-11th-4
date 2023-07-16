import React, { useState } from 'react';
import { searchAPI } from '../apis/search';
import { ReactComponent as SearchIcon } from '../assets/search.svg';
import { Sick } from '../utils/types';

export default function Search() {
  const [recommends, setRecommends] = useState<Sick[]>([]);

  const handleChangeInput = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const input = event.currentTarget.value;
    if (input === '') {
      setRecommends([]);
      return;
    }

    const res = await searchAPI(input);
    if (res.data.length === 0) {
      setRecommends([{ sickCd: '-1', sickNm: '검색어 없음' }]);
      return;
    }

    console.log('res.data :>> ', res.data);
    setRecommends(res.data);
  };
  return (
    <div>
      검색창
      <input
        className='border-2  border-solid border-cyan-600'
        type='text'
        onChange={handleChangeInput}
      />
      <ul>
        {recommends.map(({ sickCd, sickNm }) => (
          <li key={sickCd} className='flex items-center hover:bg-slate-300 p-2'>
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
