import React from 'react'
import Tooltip from '@material-ui/core/Tooltip';
import IconButtom from '@material-ui/core/IconButton';

export default ({ children, onClick, tip, btnClassName, tipClassName }) => (
    <Tooltip title={tip} className={tipClassName} placement="top">
        <IconButtom onClick={onClick} className={btnClassName}>
            {children}
        </IconButtom>
    </Tooltip>
)


