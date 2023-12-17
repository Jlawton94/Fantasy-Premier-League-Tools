import { SubmitHandler, useForm } from "react-hook-form"

type Inputs = {
    teamId: string
}

interface props {
    submitHandler: Function
}


const TeamPicker = ({ submitHandler }: props) => {

    const { register, handleSubmit } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        submitHandler(data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register("teamId", { required: true })}></input>
            <input type="submit" />
        </form>
    )
}

export default TeamPicker;