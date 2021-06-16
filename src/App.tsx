import { useState } from "react";
import Select, { TOption } from "./components/Select/Select";

const optionsData: TOption[] = [
  {
    label: "Test 1",
    value: "test",
  },
  {
    label: "another test",
    value: "another_test",
    disabled: true,
  },
  {
    label: "Test 2",
    value: "test2",
  },
  {
    label: "Test 3",
    value: "test5",
  },
  {
    label: "Test 5",
    value: "test4",
  },
];

const loadOptions = (query?: string) =>
  new Promise<TOption[]>((res, rej) => {
    // random resolve?
    const options = query
      ? optionsData.filter((opt) => new RegExp(query.toLowerCase()).test(opt.label.toLowerCase()))
      : optionsData;
    setTimeout(() => res(options), 1000);
  });

function App() {
  const onChange = (value?: TOption) => setState(value);

  const [state, setState] = useState<TOption>();

  return (
    <div className="App min-h-screen bg-gradient-to-r from-purple-500 to-indigo-300">
      <div className="flex flex-col min-h-screen space-y-5 justify-center items-center">
        <div className="h-6">{state && JSON.stringify(state)}</div>
        <div className="flex">
          <Select loadOptions={loadOptions} onChange={onChange} />
        </div>
      </div>
    </div>
  );
}

export default App;
