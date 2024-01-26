import { SubmitHandler, useForm } from "react-hook-form"
import { useParams } from "react-router-dom"

type Inputs = {
    teamId: string
}

interface props {
    submitHandler: Function
}


const TeamPicker = ({ submitHandler }: props) => {

    const { id } = useParams();
    const { register, handleSubmit } = useForm<Inputs>({ defaultValues: { teamId: id } })

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