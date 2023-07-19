import React, { ReactNode, useCallback, useMemo, useRef } from 'react';
import styled, { css } from 'styled-components';
import { Sick } from '../utils/types';
import { ReactComponent as SearchIcon } from '../assets/search.svg';
import { COLOR } from '../utils/styles';

interface ModalProps {
  onClose: () => void;
  searchKeyword: string;
  suggestions: Sick[];
  selectedIdx: number;
  setInput: React.Dispatch<React.SetStateAction<string>>;
}

export default function SearchDropdown({
  onClose,
  searchKeyword,
  selectedIdx,
  suggestions,
  setInput,
}: ModalProps) {
  const handleSetInput = useCallback(
    (text: string) => {
      setInput(text);
      onClose();
    },
    [onClose, setInput],
  );

  const suggestionListJsx = useMemo((): ReactNode => {
    if (suggestions.length === 0) return <NoItemText>검색어 없음</NoItemText>;
    return suggestions?.map(({ sickCd, sickNm }, idx) => (
      <SearchItemWrap
        onClick={() => handleSetInput(sickNm)}
        as='li'
        key={sickCd}
        $isActive={idx === selectedIdx}
      >
        <SearchIcon fill={COLOR.gray300} />
        <SearchText>{sickNm}</SearchText>
      </SearchItemWrap>
    ));
  }, [handleSetInput, suggestions, selectedIdx]);

  return (
    <Wrap>
      <SearchItemWrap>
        <SearchIcon fill={COLOR.gray300} />
        <SearchText>{searchKeyword}</SearchText>
      </SearchItemWrap>
      <RecommendText>추천 검색어</RecommendText>
      <ul>{suggestionListJsx}</ul>
    </Wrap>
  );
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

  cursor: pointer;

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

const NoItemText = styled.li`
  margin-left: 20px;
  font-size: 14px;
  color: ${COLOR.gray300};
`;
