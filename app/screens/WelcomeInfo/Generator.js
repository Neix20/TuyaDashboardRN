
import { Images } from "@config";

function GenQuestion() {
    let arr = [];

    arr = [
        {
            question: "What is your gender?",
            option: [
                {
                    name: "Male",
                    uri: Images.genderMale
                },
                {
                    name: "Female",
                    uri: Images.genderFemale
                },
            ]
        }
    ];

    return arr;
}

export {
    GenQuestion
}