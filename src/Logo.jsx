import React from 'react';

export const Logo = props => (
  <h1>
    {/* prettier-ignore */}
    <style jsx>{`
    h1 {
      font-family: sans-serif;
      grid-area: logo;
      color: #f60;
      text-align: center;
      font-weight: bold;
      }
    `}
    </style>
    パワポ<br />カラオケ
  </h1>
);

export default Logo;
