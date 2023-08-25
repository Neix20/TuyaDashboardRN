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
        },
        {
            question: "What is your company team size?",
            option: [
                {
                    name: "1 - 4",
                    uri: Images.teamA
                },
                {
                    name: "5 - 20",
                    uri: Images.teamB
                },
                {
                    name: "21 - 40",
                    uri: Images.teamC
                },
                {
                    name: "41+",
                    uri: Images.teamD
                },
            ]
        },
        {
            question: "How big is your company?",
            option: [
                {
                    name: "Startup",
                    uri: Images.companyA
                },
                {
                    name: "Small",
                    uri: Images.companyB
                },
                {
                    name: "Medium",
                    uri: Images.companyC
                },
                {
                    name: "Big",
                    uri: Images.companyD
                },
            ]
        },
        {
            question: "What is your field?",
            option: [
                {
                    name: "Food & Beverage",
                    uri: Images.fieldA
                },
                {
                    name: "Engineering",
                    uri: Images.fieldB
                },
                {
                    name: "Government",
                    uri: Images.fieldC
                },
                {
                    name: "Education",
                    uri: Images.fieldD
                },
            ]
        },
        {
            question: "Which department are you in?",
            option: [
                {
                    name: "Warehouse",
                    uri: Images.departmentA
                },
                {
                    name: "Manufacturing",
                    uri: Images.departmentB
                },
                {
                    name: "Office",
                    uri: Images.departmentC
                },
                {
                    name: "Research & Development",
                    uri: Images.departmentD
                }
            ]
        }
    ];

    return arr;
}

export {
    GenQuestion
}