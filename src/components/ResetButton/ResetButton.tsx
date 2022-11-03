import React from 'react';

interface Props {
  handleResetAll: () => void;
}

export const ResetButton: React.FC<Props> = ({ handleResetAll }) => (
  <div className="panel-block">
    <a
      data-cy="ResetAllButton"
      href="#/"
      className="button is-link is-outlined is-fullwidth"
      onClick={handleResetAll}
    >
      Reset all filters
    </a>
  </div>
);
