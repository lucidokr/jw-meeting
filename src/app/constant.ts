const CONST = {
  BIBLE_READING: 'bibleReading',
  INITIAL_CALL: 'initialCall',
  RETURN_VISIT: 'returnVisit',
  BIBLE_STUDY: 'bibleStudy',
  PRIMARY_SCHOOL: 'primarySchool',
  SECONDARY_SCHOOL: 'secondarySchool',

};

const CONST_LABEL = {
  bibleReading: 'Lettura',
  initialCall: 'Primo contatto',
  returnVisit: 'Visita ulteriore',
  bibleStudy: 'Studio biblico',
  talk: 'Discorso',

};

const USER_ROLE = {
  PRESIDENT: 'president',
  SCHOOL_OVERSEER: 'schoolOverseer',
  SECOND_SCHOOL_OVERSEER: 'secondSchoolOverseer',
  VIEWER: 'viewer',
  MIC_USC_PGM_CREATOR: 'MIC_USC_PGM_CREATOR'
};


const CONST_ARR = {
  PART_TYPE: [CONST.BIBLE_READING, CONST.INITIAL_CALL, CONST.RETURN_VISIT, CONST.BIBLE_STUDY],
  SCHOOLS: [CONST.PRIMARY_SCHOOL, CONST.SECONDARY_SCHOOL],
};


export {CONST, CONST_ARR, CONST_LABEL, USER_ROLE};


