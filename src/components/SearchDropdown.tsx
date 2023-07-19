import React, { useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import { Sick } from '../utils/types';
import { ReactComponent as SearchIcon } from '../assets/search.svg';
import { COLOR } from '../utils/styles';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchKeyword: string;
  suggestions: Sick[];
  selectedIdx: number;
  setInput: any;
}

export default function SearchDropdown({
  isOpen,
  onClose,
  searchKeyword,
  selectedIdx,
  suggestions,
  setInput,
}: ModalProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSetInput = (text: string) => {
    setInput(text);
    onClose();
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return isOpen ? (
    <Wrap ref={dropdownRef}>
      <SearchItemWrap>
        <SearchIcon fill={COLOR.gray300} />
        <SearchText>{searchKeyword}</SearchText>
      </SearchItemWrap>
      <RecommendText>추천 검색어</RecommendText>
      <ul>
        {suggestions?.map(({ sickCd, sickNm }, idx) => (
          <SearchItemWrap
            onClick={() => handleSetInput(sickNm)}
            as='li'
            key={sickCd}
            $isActive={idx === selectedIdx}
          >
            <SearchIcon fill={COLOR.gray300} />
            <SearchText>{sickNm}</SearchText>
          </SearchItemWrap>
        ))}
      </ul>
    </Wrap>
  ) : null;
}

const Wrap = styled.div`
  position: absolute;
  top: 80px;
  left: 0px;

  width: 490px;
  padding: 20px 0 10px 0;

  background-color: white;
  border-radius: 10px;
`;

const RecommendText = styled.p`
  font-size: 15px;
  padding: 5px 20px;
`;

const SearchItemWrap = styled.div<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;

  padding: 7px 20px;

  ${({ $isActive }) =>
    $isActive &&
    css`
      background-color: ${COLOR.gray100};
    `}

  &:hover {
    background-color: ${COLOR.gray100};
  }
`;

const SearchText = styled.span`
  margin-left: 10px;
  font-size: 16px;
`;
