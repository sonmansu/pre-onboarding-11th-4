import React, { useRef, useState } from 'react';
import { searchAPI } from '../apis/search';
import { ReactComponent as SearchIcon } from '../assets/search.svg';
import { Sick } from '../utils/types';
import { styled } from 'styled-components';
import { COLOR } from '../utils/styles';
import SearchDropdown from './SearchDropdown';
import { Cache } from '../utils/Cache';

export default function Search() {
  const [isFocused, setIsFocused] = useState(false);
  const [input, setInput] = useState('');
  const [recommends, setRecommends] = useState<Sick[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(-1);

  const cache = useRef(new Cache<Sick[]>()).current;

  const handleChangeInput = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const input = event.currentTarget.value;
    setInput(input);
    setSelectedIdx(-1);
    if (input === '') {
      setRecommends([]);
      return;
    }

    if (cache.has(input)) {
      setRecommends(cache.get(input));
      return;
    }

    try {
      const result = await searchAPI(input);
      console.info('calling api');

      cache.set(input, result);
      setRecommends(result);
    } catch (error) {
      console.log('error :>> ', error);
    }
  };

  const handleOpenDropdown = () => {
    setIsFocused(true);
    setSelectedIdx(-1);
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
    <Wrap>
      <Title>
        국내 모든 임상시험 검색하고
        <br />
        온라인으로 참여하기
      </Title>
      <SearchWrap $isFocused={isFocused}>
        {!isFocused && (
          <SearchIconWrap>
            <SearchIcon fill='#A7AFB7' />
          </SearchIconWrap>
        )}
        <Input
          type='search'
          value={input}
          placeholder='      질환명을 입력해 주세요.'
          onChange={handleChangeInput}
          onKeyDown={handleKeyDown}
          onFocus={handleOpenDropdown}
        />
        <SearchBtn>
          <SearchIcon width={21} height={21} fill='white' />
        </SearchBtn>
        {
          <SearchDropdown
            suggestions={recommends}
            isOpen={isFocused}
            searchKeyword={input}
            onClose={() => setIsFocused(false)}
            setInput={setInput}
            selectedIdx={selectedIdx}
          />
        }
      </SearchWrap>
    </Wrap>
  );
}

const Wrap = styled.div`
  height: 450px;
  padding-top: 80px;
  background-color: #cae9ff;
`;

const Title = styled.h1`
  margin-bottom: 40px;

  font-size: 30px;
  font-weight: 700;
  text-align: center;
`;

const SearchWrap = styled.div<{ $isFocused: boolean }>`
  display: flex;
  align-items: center;

  position: relative;

  margin: auto;
  width: 490px;
  height: 70px;
  padding-left: 20px;
  padding-right: 10px;
  border-radius: 42px;

  background-color: white;
  outline: 2px solid ${({ $isFocused }) => ($isFocused ? COLOR.blue : 'white')};
`;

const SearchIconWrap = styled.div`
  position: absolute;
`;

const Input = styled.input`
  flex: 1;

  padding: 20px 10px 20px 0px;

  &:focus-visible {
    outline: none;
  }
  &:focus::placeholder {
    color: transparent;
  }
`;

const SearchBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 48px;
  height: 48px;
  margin-left: 10px;

  border-radius: 50%;

  background-color: ${COLOR.blue};
`;
