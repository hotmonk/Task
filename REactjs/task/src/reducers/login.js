const initialState={
    id:null,
}

const reducer=(state=initialState,action)=>{
    switch(action.type){
        case 'LOGIN':
            return {
                id:action.id
            };
            break;
        case 'LOGOUT':
            return {
                id:null,
            };
            break;
        default :
            return state;
    }
};

export default reducer;