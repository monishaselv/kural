import React, { useEffect, useState,useRef ,useCallback,useMemo} from 'react';
import { Button } from 'react-native';

function useDebounce<T>(value : T, delay: number): T {
    const [debounce, setDebounce] = useState(value);
    useEffect(() => {
     const handler = setTimeout(() => {
        setDebounce(value)
        }, delay);
        return () => clearTimeout(handler);
    },[value,delay])
    return debounce;
}
function useDebounced(value, delay) {
    const [debounce, setDebounce] = useState(value);
    useEffect(() => {
       const handler= setTimeout(() => {
            setDebounce(value)
        },delay)
        return () => clearTimeout(handler);
    },[value,delay]);
    return debounce;
}
function useThrottle<T> (value : T, limit: number) : T {
    const [throttle, setThrottle] = useState(value);
    const lastRun = useRef(Date.now());
    useEffect(() => {
      const handler = setTimeout(() => {
         if(  Date.now() - lastRun >= limit) {
       lastRun.current = Date.now()
       
        setThrottle(value)
       }
      },limit - (Date.now()- lastRun.current))
      return () => clearTimeout(handler);
    },[value,limit])
    return throttle;
}
useEffect(() => {
    const loadData = async () => {
        const response = await fetch('')
        const data = await response.json();
        return data
    }
    loadData()
},[])

const ParentComponent = React.memo(({onPress}: any) => {
    return <Button onPress={onPress} />
})
const onPress = useCallback(() => {
    console.log('');
},[]);
const ExpensiveCalculation = useMemo((items) => {
    return items.reduce((sum, item) => sum+ item.price ,0);
},[]);
const ExpensiveCalculation2 = useMemo ((items) => {
    // return filter.items()
},[])
const useDeebounce = ({value, delay} : {value: any, delay: number}) => {
    const [debounce, setDebounce] = useState(value);
    useEffect(() => {
     const timer =  setTimeout(() => {
          setDebounce(value)
      },delay);
      return () => clearTimeout(timer);
    },[value,delay]);
    return debounce;
}
const sample = [12,2,3,7,6];
const getEven = useMemo(() => {return sample.filter((item: number) => item%2 == 0)},[sample]);
const fruits = useMemo(() => {
  return sample.filter(item => item%2 == 0);
}, [sample]);

const ParentComponent = (sample) => {
    const even = useMemo(() => {
        return sample.filter((item: any) => item % 2 === 0);
    },[])
    
    const onClick = useCallback(() => {
        console.log('num',even)
    },[even])
    return <ChildComponent onPress={onClick}/>
}
const ChildComponent = React.memo(({onPress} : any) => {
    return (
        <Button onPress={onPress} />
    );
})
function debounceFn  ({value, delay}: {value: any, delay: number}) {
    const [debounce, setDebounce] = useState('');
    useEffect(() => {
       const handler = setTimeout(() => {
        setDebounce(value)
       },delay)
       return clearTimeout(handler);
    },[value,delay])
    return debounce;
}