import { Key, useReducer, useRef, useEffect, forwardRef, ChangeEvent } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useWindowEvent } from "../../hooks/use-window-event";

import Option from "./Option";
import Spinner from "../icons/Spiner";

export type TOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

export interface SelectProps {
  loadOptions: (query?: string) => Promise<TOption[]>;
  onChange: (value?: TOption) => void;
  value?: TOption;
  disabled?: boolean;
  placeholder?: string;
  emptyText?: string;
}

enum SelectStates {
  Closed,
  Open,
}

type State = {
  open: SelectStates;
  searchQuery: string;
  options: TOption[];
  value: TOption | null;
  loading?: boolean;
};

enum ActionType {
  Open,
  Close,
  SetOptions,
  Search,
  ClearValue,
  SelectOption,
  SetLoadingState,
}

type Actions =
  | { type: ActionType.Open }
  | { type: ActionType.Close }
  | { type: ActionType.SetOptions; options: TOption[] }
  | { type: ActionType.Search; searchQuery: string }
  | { type: ActionType.SelectOption; value: TOption | null }
  | { type: ActionType.ClearValue }
  | { type: ActionType.SetLoadingState; loading: boolean };

// set states
const reducers = (state: State, action: Actions): State => {
  switch (action.type) {
    case ActionType.Open:
      return { ...state, open: SelectStates.Open };
    case ActionType.Close:
      return { ...state, open: SelectStates.Closed, searchQuery: "" };
    case ActionType.SetOptions:
      return { ...state, options: action.options };
    case ActionType.SelectOption:
      return { ...state, value: action.value };
    case ActionType.Search:
      return { ...state, searchQuery: action.searchQuery };
    case ActionType.ClearValue:
      return { ...state, value: null };
    case ActionType.SetLoadingState:
      return { ...state, loading: action.loading };
    default:
      return state;
  }
};

const Select = forwardRef<HTMLInputElement, SelectProps>((props, ref) => {
  const {
    value,
    onChange,
    loadOptions,
    placeholder = "Выберите значение",
    emptyText = "Нет подходящих опций 🙁",
  } = props;

  const [state, dispatch] = useReducer(reducers, {
    open: SelectStates.Closed,
    searchQuery: "",
    options: [],
    value,
  } as State);

  const loadOptionsHandler = useDebouncedCallback((searchQuery: string) => {
    dispatch({ type: ActionType.SetLoadingState, loading: true });
    loadOptions(searchQuery)
      .then((options) => {
        dispatch({ type: ActionType.SetOptions, options });
      })
      .catch((e) => {
        console.error("Load options error:", e);
      })
      .finally(() => {
        dispatch({ type: ActionType.SetLoadingState, loading: false });
      });
  }, 600);

  useEffect(() => {
    loadOptionsHandler(state.searchQuery);
  }, [state.searchQuery, loadOptionsHandler]);

  const selectRef = useRef<HTMLDivElement>(null);

  // handle outside click
  useWindowEvent("mousedown", (event) => {
    const target = event.target as HTMLElement;
    if (selectRef.current?.contains(target)) {
      return;
    }
    if (state.open !== SelectStates.Open) {
      return;
    }
    dispatch({ type: ActionType.Close });
  });

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const searchQuery = target.value;
    dispatch({ type: ActionType.Search, searchQuery });
  };

  const clearValue = () => {
    dispatch({ type: ActionType.ClearValue });
    onChange()
  };

  const handleChange = (value: TOption) => {
    dispatch({ type: ActionType.SelectOption, value });
    onChange(value);
  };

  const openOptions = () => {
    dispatch({ type: ActionType.Open });
  };

  return (
    <div className="relative inline-flex" ref={selectRef}>
      <input
        autoCapitalize="off"
        autoCorrect="off"
        autoComplete="off"
        ref={ref}
        className="w-full rounded border hover:cursor-default focus:cursor-auto focus:outline-none focus:ring placeholder-black py-2 pl-2 pr-8"
        value={state.searchQuery}
        placeholder={state.value?.label || placeholder}
        onChange={handleSearch}
        onFocus={openOptions}
      />
      {/* clear button */}
      {state.value && (
        <button className="absolute inset-y-0 right-7 p-2" onClick={clearValue}>
          x
        </button>
      )}

      {/* loading indicator */}
      {state.loading && state.open === SelectStates.Open ? (
        <div className="absolute inset-y-0 right-0 p-2 flex items-center pointer-events-none">
          <Spinner />
        </div>
      ) : (
        <div className="absolute inset-y-0 right-0 p-3 flex items-center pointer-events-none">
          <div className="border-r-2 border-b-2 border-black transform rotate-45 w-[7px] h-[7px]" />
        </div>
      )}

      {/* options */}
      {state.open === SelectStates.Open && (
        <ul className="absolute top-12 w-full bg-white rounded">
          {state.options.length ? (
            state.options.map((option, idx) => (
              <Option
                key={option.value as Key}
                label={option.label}
                disabled={option.disabled}
                isFirst={idx === 0}
                isLast={state.options.length - 1 === idx}
                isCurrent={state.value === option}
                onClick={() => handleChange(option)}
              />
            ))
          ) : (
            <li className="px-2 py-2 text-sm text-center text-gray-500">{emptyText}</li>
          )}
        </ul>
      )}
    </div>
  );
});

export default Select;
