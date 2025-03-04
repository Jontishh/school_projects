import { FC } from 'react';
import Select, { CSSObjectWithLabel, SingleValue, StylesConfig, components } from 'react-select'

import '../../App.css'

import { User } from '../../API/interfaces';

import person from '../../assets/person.svg'


interface DropdownMenuProps {
    users: User[];
    setSelectedId: (id: number) => void
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ users, setSelectedId }) => {

    const ValueContainer: FC<any> = (props) => {

        return (
            <>
                <img src={person} style={{ width: 20, marginLeft: 5, marginRight: 0 }} alt="" />
                <components.ValueContainer {...props} />
            </>

        );
    };

    const customStyles: StylesConfig<{ value: number, label: string }, false> = {
        valueContainer: (base: CSSObjectWithLabel) => ({
            ...base,
            textAlign: 'left',
            color: '#000000',
            fontFace: 'Ubuntu',
            fontWeight: 400,
            fontSize: 12,

        }),
        control: (base: CSSObjectWithLabel, state: any) => ({
            ...base,
            background: state.hasValue ? '#F5F5F5' : 'white',
            boxShadow: 'none',
            '&:hover': {
                border: '1px #3C3C43'
            },
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#3C3C43',


        }),
        singleValue: (base: CSSObjectWithLabel) => ({
            ...base,
            color: '#000000',
        }),

        //TODO: Fix so that menu gets a border
        menu: (base: CSSObjectWithLabel) => ({
            ...base,
            borderRadius: 5,
            border: '1px #3C3C43'
        }),

        option: (base: CSSObjectWithLabel, state: any) => ({
            ...base,
            textAlign: 'left',
            background: state.isFocused ? '#F5F5F5' : 'white',
            color: '#000000',
            fontFace: 'Ubuntu',
            fontWeight: 400,
            fontSize: 12,

        }),
        dropdownIndicator: (base: CSSObjectWithLabel, state: any) => ({
            ...base,
            transform: state.selectProps.menuIsOpen && 'rotate(180deg)'
        })
    };

    const handleChange = (selectedOption: SingleValue<{ value: number, label: string; }>) => {
        if(selectedOption) {
            setSelectedId(selectedOption?.value);
        } else {
            throw new Error("Error selecting list item");
        }
    }    

    return (
        <>
            <Select
                className='dropDownMenu'
                onChange={handleChange}
                options={users.map(user => ({ value: user.id, label: user.name }))}
                isSearchable={false}
                isClearable={false}
                placeholder='Your name'
                styles={customStyles}
                components={{ IndicatorSeparator: () => null, ValueContainer: ValueContainer }}
            />
        </>
    )
}

export default DropdownMenu;