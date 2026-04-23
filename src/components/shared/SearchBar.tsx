import React from 'react';
import { IonCard, IonSearchbar } from '@ionic/react';
import './shared.css';

interface SearchBarProps {
  value: string;
  onSearch: (value: string) => void;
  placeholder?: string;
  debounce?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onSearch,
  placeholder = 'Buscar...',
  debounce = 300,
}) => {
  return (
    <IonCard className="shared-searchbar-wrapper">
      <IonSearchbar
        className="shared-searchbar"
        value={value}
        debounce={debounce}
        placeholder={placeholder}
        onIonInput={(e) => onSearch(e.detail.value ?? '')}
        animated
        mode="ios"
      />
    </IonCard>
  );
};

export default SearchBar;
