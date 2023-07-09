import React, { useCallback, useEffect, useState } from 'react';
import { Input, Divider } from 'antd';

import './index.scss';

const { TextArea } = Input;

interface Props {
    defaultValue: string;
    onChange: (value: string | undefined) => void;
}

const CustomViewContent = ({ defaultValue, onChange }: Props) => {
    const [value, setValue] = useState<string>(defaultValue);

    useEffect(() => {
        onChange(value);
    }, [value]);

    const _onChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
    }, [])

    return <div className='example-plugin-container'>
        <h2>Example View</h2>

        <Divider></Divider>
        <h3>Input:</h3>
        <TextArea onChange={_onChange} placeholder='please input text' defaultValue={defaultValue}></TextArea>

        <Divider></Divider>
        <h3>Saved:</h3>
        <p>{value || <span className='empty-text'>You have inputed nothing.</span>}</p>
    </div>;
}

export default CustomViewContent;
