import React from 'react';
import styles from '../../styleComponents/Overview.module.css';

const OverviewCheckmark = (props) => {
  const {
    styleNamePic,
    styleButtonHandler,
    styleChoice,
    styleImgSelected,
  } = props;

  const imgForButton = (
    <input
      tabIndex={0}
      type="image"
      role="tab"
      className={styles.stylesButtonsImgs}
      onClick={styleButtonHandler}
      onKeyDown={styleButtonHandler}
      src={styleNamePic[0].thumbnail_url}
      alt={styleChoice}
    />
  );

  return (
    <div>
      {(styleImgSelected === styleNamePic[0].thumbnail_url)
        ? (
          <svg className={styles.styleButtonsOverlay} width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
            <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
          </svg>
        )
        : null}
      {imgForButton}
    </div>
  );
};

export default OverviewCheckmark;
