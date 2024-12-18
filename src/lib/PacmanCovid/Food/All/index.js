import React from 'react';
import PropTypes from 'prop-types';
import Food from '../';
import './style.scss';

export default function AllFood({ food, paths, ...props }) {

    const items =food.map(({ key, ...item }) => (
        <Food key={key} {...item} path={paths} {...props} />
    ));

    // const items = food.filter(({ eaten }) => !eaten)
    //     .map(({ key, ...item }) => (
    //         <Food key={key} {...item} path={paths} {...props} />
    //     ));

    return (
        <div className="food-all">
            {items}
        </div>
    );
}

AllFood.propTypes = {
    food: PropTypes.array.isRequired
};

