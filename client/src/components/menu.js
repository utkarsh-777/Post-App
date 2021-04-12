import React, { useContext } from 'react'
import { useHistory } from 'react-router'
import { Icon , Menu } from 'semantic-ui-react'
import { REMOVE_USER } from '../context/action.types'
import { UserContext } from '../context/context'

const MenuExampleSecondary = ({ai}) =>  {

    const {dispatch,state} = useContext(UserContext)

    const activeItem = ai
    const history = useHistory();

    const handleItemClick = (e, { name }) => {
        if(name === 'logout'){
            dispatch({type:REMOVE_USER});
            localStorage.clear();
        }
        history.push(`/${name}`)
    }

    return (
      <Menu secondary>
        <Menu.Item 
        name="POST APP"
        />
        {state ? 
            <>
                <Menu.Item
                    name='Home'
                    active={activeItem === ''}
                    onClick={(e)=>handleItemClick(e,{name:''})}
                />
                <Menu.Item
                    name='Profile'
                    active={activeItem === 'profile'}
                    onClick={(e)=>handleItemClick(e,{name:'profile'})}
                />
                <Menu.Item
                    name='Create Post'
                    active={activeItem === 'create-post'}
                    onClick={(e)=>handleItemClick(e,{name:'create-post'})}
                />
                <Menu.Item
                    name='Liked Posts'
                    active={activeItem === 'liked-post'}
                    onClick={(e)=>handleItemClick(e,{name:'liked-post'})}
                />
                <Menu.Item
                    name='Unliked Posts'
                    active={activeItem === 'unliked-post'}
                    onClick={(e)=>handleItemClick(e,{name:'unliked-post'})}
                />
                <Menu.Menu position='right'>
                    <Menu.Item>
                        <a href='#'><Icon onClick={()=>history.push('/search-posts')} name="search" /></a>
                    </Menu.Item>
                    <Menu.Item
                        style={{color:'red'}}
                        name='Logout'
                        active={activeItem === 'logout'}
                        onClick={(e)=>handleItemClick(e,{name:'logout'})}
                    />
                </Menu.Menu>
            </>
            :
            <>
                <Menu.Menu position='right'>
                    <Menu.Item
                        name='Login'
                        active={activeItem === 'login'}
                        onClick={(e)=>handleItemClick(e,{name:'login'})}
                    />
                    <Menu.Item
                        name='Signup'
                        active={activeItem === 'signup'}
                        onClick={(e)=>handleItemClick(e,{name:'signup'})}
                    />
                </Menu.Menu>
            </>
        }
      </Menu>
    )
}

export default MenuExampleSecondary;