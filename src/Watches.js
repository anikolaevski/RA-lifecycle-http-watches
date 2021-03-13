import React from 'react';

import Container from './components/Container';
/**
 * Подготовка данных, рендер компонентов
 */
export function General () {
  // Подготовка данных
  const curDate = new Date();
  const datestr = `${curDate.toLocaleDateString()} ${curDate.toLocaleTimeString()}`;

  // console.log(TopVisits);
  return (
    <React.Fragment>
      <div className="General">
        <Container class="FirstClass">Страница в разработке, {datestr}</Container>
      </div>
    </React.Fragment>
  );
}
