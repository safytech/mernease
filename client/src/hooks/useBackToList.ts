import { useLocation, useNavigate } from "react-router-dom";

const useBackToList = (listPath: string) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getPageState = () => {
    const loc = (location && (location.state as any)) || null;

    if (loc && typeof loc.pageIndex === "number") {
      return {
        pageIndex: loc.pageIndex,
        pageSize: typeof loc.pageSize === "number" ? loc.pageSize : 8,
      };
    }

    const hist = (window.history && (window.history.state as any)) || null;
    const candidate = hist?.usr ?? hist;

    if (candidate && typeof candidate.pageIndex === "number") {
      return {
        pageIndex: candidate.pageIndex,
        pageSize: typeof candidate.pageSize === "number"
          ? candidate.pageSize
          : 8,
      };
    }

    return { pageIndex: 0, pageSize: 8 };
  };

  const pageState = getPageState();
  
  const goBackToList = () => {
    navigate(listPath, {
      state: {
        pageIndex: pageState.pageIndex ?? 0,
        pageSize: pageState.pageSize ?? 8,
      },
    });
  };

  return { goBackToList };
};

export default useBackToList;
