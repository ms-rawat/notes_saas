import { useEffect } from 'react';

const usePageTitle = (title) => {
    useEffect(() => {
        document.title = `${title} | NotesVerse`;
    }, [title]);
};

export default usePageTitle;
